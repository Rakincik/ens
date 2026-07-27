import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { code, cartItems } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Lütfen bir kupon kodu girin." },
        { status: 400 }
      );
    }

    // Kuponu veritabanında ara
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { error: "Geçersiz veya aktif olmayan kupon kodu." },
        { status: 404 }
      );
    }

    // Süre kontrolü
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json(
        { error: "Bu kupon kodunun kullanım süresi dolmuş." },
        { status: 400 }
      );
    }

    // Ürüne özel kupon kontrolü
    if (coupon.courseId) {
      const isProductInCart = cartItems.includes(coupon.courseId);
      if (!isProductInCart) {
        // İlgili kurs adını bulup hata mesajını zenginleştirelim
        const course = await prisma.course.findUnique({
          where: { id: coupon.courseId },
          select: { title: true },
        });
        
        return NextResponse.json(
          { 
            error: `Bu kupon sadece "${course?.title || 'ilgili ürün'}" paketi için geçerlidir.` 
          },
          { status: 400 }
        );
      }

      // Sepette o kurs var ama kupon kullanımına açık mı?
      const targetCourse = await prisma.course.findUnique({
        where: { id: coupon.courseId },
        select: { isCouponEligible: true },
      });

      if (!targetCourse?.isCouponEligible) {
        return NextResponse.json(
          { error: "Bu ürün kupon kullanımına kapalıdır." },
          { status: 400 }
        );
      }
    } else {
      // Genel sepet kuponu: Sepette en az bir adet kupona açık ürün olmalı
      const eligibleCourses = await prisma.course.findMany({
        where: {
          id: { in: cartItems },
          isCouponEligible: true,
        },
      });

      if (eligibleCourses.length === 0) {
        return NextResponse.json(
          { error: "Sepetinizdeki ürünler indirim kuponu kullanımına uygun değildir." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      message: "Kupon başarıyla doğrulandı.",
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        courseId: coupon.courseId,
      },
    });
  } catch (error) {
    console.error("Coupon Validate Error:", error);
    return NextResponse.json(
      { error: "Kupon doğrulama sırasında sistemsel bir hata oluştu." },
      { status: 500 }
    );
  }
}
