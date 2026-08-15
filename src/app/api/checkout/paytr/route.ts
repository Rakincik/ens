import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cartItems, user, totalAmount, installment_count: userInstallment, card_type: userCardType, successUrl, failUrl } = body;

    if (!cartItems || cartItems.length === 0 || !user || !user.email) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    // Get real user IP in production reliably
    const forwardedFor = req.headers.get("x-forwarded-for");
    const cfIp = req.headers.get("cf-connecting-ip");
    const realIp = req.headers.get("x-real-ip");
    
    let rawIp = cfIp || forwardedFor?.split(',')[0]?.trim() || realIp || "85.105.10.10";
    
    // Ignore IPv6 localhost loopback for PayTR tests, use fallback
    if (rawIp === "::1" || rawIp === "127.0.0.1") {
        rawIp = "85.105.10.10"; 
    }
    const user_ip = rawIp;

    // 1. Generate alphanumeric merchant_oid (PayTR doesn't allow special characters like dashes in UUIDs)
    const merchant_oid = "TOA" + Date.now().toString() + Math.floor(Math.random() * 1000).toString();

    // 2. Create a PENDING order in the database
    const order = await prisma.order.create({
      data: {
        userId: user.id, // Ensure user.id is passed from the client
        totalAmount: totalAmount,
        status: "PENDING",
        paymentId: merchant_oid, // Save the PayTR merchant_oid to the database
        orderItems: {
          create: cartItems.map((item: any) => ({
            courseId: item.id,
            price: item.price,
          })),
        },
      },
    });

    // 3. Prepare PayTR Variables
    const merchant_id = (process.env.PAYTR_MERCHANT_ID || "474882").trim();
    // Fallback values MUST match the .env file exactly to prevent token hash mismatch if process.env fails to load
    const merchant_key = (process.env.PAYTR_MERCHANT_KEY || "Z6TA4Ze5d7kqCbud").trim();
    const merchant_salt = (process.env.PAYTR_MERCHANT_SALT || "bgbC7UqJ5qt4rCWs").trim();
    
    const email = (user.email || "").trim();
    // PayTR Direct API expects amount as a decimal string (e.g. "100.99" or "100"), NOT * 100 like iFrame!
    const payment_amount = Number.isInteger(totalAmount) ? totalAmount.toString() : totalAmount.toFixed(2); 
    const currency = "TL";
    const test_mode = process.env.PAYTR_TEST_MODE || "0"; // Default to 0 (Live) to match panel settings
    
    // Direkt API spesifik degiskenler
    const payment_type = "card";
    const installment_count = userInstallment || "0"; // Müşterinin seçtiği taksit sayısı
    const non_3d = "0"; // 3D Secure is mandatory
    
    const user_name = user.name + " " + (user.surname || "");
    const user_address = "Test Adres, İstanbul"; // Get from user or default
    const user_phone = user.phone || "05555555555";
    

    // Set fallback domain as the production domain
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.turkceoabtdeyiz.com";
    const merchant_ok_url = successUrl || `${appUrl}/odeme/basarili`;
    const merchant_fail_url = failUrl || `${appUrl}/odeme/hata`;
    
    const debug_on = "1";
    const client_lang = "tr";
    const non3d_test_failed = "0";
    
    // Taksitli islemlerde card_type zorunludur (orn: bonus, axess, world, maximum)
    let card_type = "";
    if (userCardType && installment_count !== "0") {
        card_type = userCardType.toString().toLowerCase().trim();
    }

    // 3. Prepare User Basket
    const basket = cartItems.map((item: any) => [
      item.title,
      item.price.toString(),
      1, // quantity is always 1 for digital courses
    ]);
    // Direct API requires plain JSON string, NOT Base64
    const user_basket = JSON.stringify(basket);

    // 4. Generate Hash (Direkt API Algoritmasi)
    const hashSTR = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${payment_type}${installment_count}${currency}${test_mode}${non_3d}`;
    const paytr_token_str = hashSTR + merchant_salt;
    const paytr_token = crypto.createHmac("sha256", merchant_key).update(paytr_token_str).digest("base64");

    // 5. Return JSON (Bunu frontend'de gizli form olarak render edip submit edecegiz)
    return NextResponse.json({
      paytrData: {
        merchant_id,
        user_ip,
        merchant_oid,
        email,
        payment_type,
        payment_amount,
        currency,
        test_mode,
        non_3d,
        merchant_ok_url,
        merchant_fail_url,
        user_name,
        user_address,
        user_phone,
        user_basket,
        debug_on,
        client_lang,
        paytr_token,
        non3d_test_failed,
        installment_count,
        card_type
      }
    });

  } catch (error: any) {
    console.error("Checkout PayTR Error:", error);
    return NextResponse.json({ error: `Sunucu hatası oluştu: ${error?.message}` }, { status: 500 });
  }
}
