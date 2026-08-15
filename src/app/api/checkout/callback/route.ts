import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // PayTR callback verileri urlencoded form (x-www-form-urlencoded) olarak POST edilir.
    const formData = await req.formData();
    const merchant_oid = formData.get("merchant_oid") as string;
    const status = formData.get("status") as string;
    const total_amount = formData.get("total_amount") as string;
    const hash = formData.get("hash") as string;

    const merchant_key = process.env.PAYTR_MERCHANT_KEY || "Z6TA4Ze5d7kqCbud";
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT || "bgbC7UqJ5qt4rCWs";

    // 1. Hash Doğrulama
    // paytr_token = merchant_oid + salt + status + total_amount
    const paytr_token = merchant_oid + merchant_salt + status + total_amount;
    const generated_hash = crypto.createHmac("sha256", merchant_key).update(paytr_token).digest("base64");

    if (generated_hash !== hash) {
      console.error("PAYTR HASH MISMATCH:", { expected: generated_hash, received: hash });
      // Hash uyuşmuyorsa, isteğin PayTR'dan geldiğinden emin olamayız.
      return new NextResponse("PAYTR notification failed: bad hash", { status: 400 });
    }

    // 2. Siparişi Veritabanında Bul
    const order = await prisma.order.findUnique({
      where: { paymentId: merchant_oid },
    });

    if (!order) {
      console.error("PAYTR CALLBACK ORDER NOT FOUND:", merchant_oid);
      return new NextResponse("Order not found", { status: 404 });
    }

    // 3. Sipariş zaten onaylanmışsa tekrar işlem yapma
    if (order.status === "SUCCESS" || order.status === "FAILED") {
      return new NextResponse("OK", { status: 200 }); // PayTR'a OK dön, tekrar atmasın.
    }

    // 4. Durumu Güncelle
    if (status === "success") {
      await prisma.order.update({
        where: { paymentId: merchant_oid },
        data: {
          status: "SUCCESS",
          // İstiyorsanız paymentId gibi alanları da ekleyebilirsiniz
        },
      });
      console.log(`Order ${merchant_oid} SUCCESS!`);
    } else {
      await prisma.order.update({
        where: { paymentId: merchant_oid },
        data: {
          status: "FAILED",
        },
      });
      console.log(`Order ${merchant_oid} FAILED!`);
    }

    // PayTR sistemine "İşlemi aldık, bir daha bu sipariş için bana webhook gönderme" demek için sadece "OK" (string) dönüyoruz.
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("PAYTR Callback Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
