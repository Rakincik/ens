import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generatePaytrToken } from "@/lib/paytr";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");

    if (!tokenCookie) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekmektedir." },
        { status: 401 }
      );
    }

    const userPayload = await verifyToken(tokenCookie.value);
    if (!userPayload) {
      return NextResponse.json(
        { error: "Oturumunuz geçersiz veya süresi dolmuş." },
        { status: 401 }
      );
    }

    const { cartItems, couponCode } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Sepetinizde ürün bulunmamaktadır." },
        { status: 400 }
      );
    }

    // Sepetteki ürünleri veritabanından doğrula
    const itemIds = cartItems.map((item: any) => item.id);
    const dbCourses = await prisma.course.findMany({
      where: {
        id: { in: itemIds },
        isActive: true,
      },
    });

    if (dbCourses.length === 0) {
      return NextResponse.json(
        { error: "Sepetteki ürünler sistemde bulunamadı veya pasif durumda." },
        { status: 400 }
      );
    }

    // Toplam tutarı hesapla
    let totalAmount = dbCourses.reduce((sum, course) => sum + course.price, 0);
    let discountAmount = 0;
    let validatedCoupon = null;

    // Kupon varsa doğrula
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase(), isActive: true },
      });

      if (coupon) {
        const isNotExpired = !coupon.expiryDate || new Date(coupon.expiryDate) > new Date();
        
        if (isNotExpired) {
          if (coupon.courseId) {
            // Ürüne özel indirim
            const targetCourse = dbCourses.find(c => c.id === coupon.courseId && c.isCouponEligible);
            if (targetCourse) {
              validatedCoupon = coupon;
              discountAmount = coupon.discountType === "PERCENTAGE" 
                ? (targetCourse.price * coupon.discountValue) / 100 
                : Math.min(coupon.discountValue, targetCourse.price);
            }
          } else {
            // Genel sepet indirimi (sadece kupona açık ürünlere uygulanır)
            validatedCoupon = coupon;
            const discountableSum = dbCourses
              .filter(c => c.isCouponEligible)
              .reduce((sum, c) => sum + c.price, 0);

            discountAmount = coupon.discountType === "PERCENTAGE"
              ? (discountableSum * coupon.discountValue) / 100
              : Math.min(coupon.discountValue, discountableSum);
          }
        }
      }
    }

    const finalAmount = Math.max(0, totalAmount - discountAmount);

    // 1. Siparişi PENDING olarak oluştur (merchant_oid için sipariş ID kullanacağız)
    const order = await prisma.order.create({
      data: {
        userId: userPayload.id,
        totalAmount: finalAmount,
        status: "PENDING",
        couponId: validatedCoupon?.id || null,
        orderItems: {
          create: dbCourses.map(course => ({
            courseId: course.id,
            price: course.price // Orijinal fiyatı kaydet
          }))
        }
      }
    });

    // 2. PayTR Basket oluştur
    // Format: [ [ "Ürün Adı", "Fiyat", Adet ], ... ]
    const basketItems: any[] = dbCourses.map(course => [
      course.title,
      course.price.toString(),
      1
    ]);

    // İndirim varsa sepet listesine ekle
    if (discountAmount > 0) {
      basketItems.push([
        `İndirim (${validatedCoupon?.code || "KUPON"})`,
        `-${discountAmount.toFixed(2)}`,
        1
      ]);
    }

    const userBasket = Buffer.from(JSON.stringify(basketItems)).toString("base64");

    // İletişim bilgileri
    // User veritabanından telefon çekilebilir, test için dolduruyoruz
    const userDb = await prisma.user.findUnique({ where: { id: userPayload.id } });

    // PayTR token üret
    const userIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const paytrParams = {
      userIp: userIp.split(",")[0].trim(),
      merchantOid: order.id,
      email: userPayload.email,
      paymentAmount: finalAmount,
      userBasket,
      userName: `${userPayload.name} ${userPayload.surname}`,
      userAddress: "Ankara, Türkiye", // Fatura adresi (Sanal ürün olduğu için zorunlu alan dolduruldu)
      userPhone: "05555555555",
      okUrl: process.env.PAYTR_MERCHANT_OK_URL || "http://localhost:3000/sepet/basarili",
      failUrl: process.env.PAYTR_MERCHANT_FAIL_URL || "http://localhost:3000/sepet/basarisiz",
      testMode: process.env.NODE_ENV === "production" ? "0" : ("1" as any)
    };

    const paytrData = generatePaytrToken(paytrParams);

    // PayTR iframe token alma isteği gönder
    const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        merchant_id: paytrData.merchantId,
        user_ip: paytrParams.userIp,
        merchant_oid: paytrParams.merchantOid,
        email: paytrParams.email,
        payment_amount: paytrData.amountStr,
        paytr_token: paytrData.token,
        user_basket: paytrParams.userBasket,
        user_name: paytrParams.userName,
        user_address: paytrParams.userAddress,
        user_phone: paytrParams.userPhone,
        no_install: paytrData.noInstall,
        max_install: paytrData.maxInstall,
        currency: paytrData.currency,
        test_mode: paytrData.testMode,
        ok_url: paytrParams.okUrl,
        fail_url: paytrParams.failUrl,
      }),
    });

    const textData = await response.text();
    
    // PayTR JSON yanıt döner. Başarılı ise {"status":"success","token":"..."}
    let result: any;
    try {
      result = JSON.parse(textData);
    } catch (e) {
      return NextResponse.json(
        { error: "PayTR API yanıtı ayrıştırılamadı.", details: textData },
        { status: 500 }
      );
    }

    if (result.status !== "success") {
      return NextResponse.json(
        { error: "PayTR token alınamadı.", details: result.reason },
        { status: 400 }
      );
    }

    // Siparişi PayTR token (paymentId) ile güncelle
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: result.token }
    });

    return NextResponse.json({
      status: "success",
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${result.token}`
    });
  } catch (error) {
    console.error("PayTR Token API Error:", error);
    return NextResponse.json(
      { error: "Ödeme oturumu oluşturulurken sistemsel bir hata oluştu." },
      { status: 500 }
    );
  }
}
