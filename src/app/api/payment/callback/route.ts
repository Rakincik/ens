import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPaytrCallback } from "@/lib/paytr";

export async function POST(request: Request) {
  try {
    // PayTR callback, content-type x-www-form-urlencoded olarak gelir.
    const formData = await request.formData();
    
    const merchantOid = formData.get("merchant_oid") as string;
    const status = formData.get("status") as string;
    const totalAmount = formData.get("total_amount") as string;
    const hash = formData.get("hash") as string;
    const failedReasonCode = formData.get("failed_reason_code") as string;
    const failedReasonMsg = formData.get("failed_reason_msg") as string;

    if (!merchantOid || !status || !hash) {
      return new Response("FAIL: Missing params", { status: 400 });
    }

    // 1. Signature Doğrula
    const isSignatureValid = verifyPaytrCallback(merchantOid, status, totalAmount, hash);
    if (!isSignatureValid) {
      console.error(`PayTR Callback Signature Invalid for Order: ${merchantOid}`);
      return new Response("FAIL: Invalid signature", { status: 400 });
    }

    // 2. Siparişi bul
    const order = await prisma.order.findUnique({
      where: { id: merchantOid },
      select: { id: true, couponId: true }
    });

    if (!order) {
      console.error(`PayTR Callback Order Not Found in Database: ${merchantOid}`);
      return new Response("FAIL: Order not found", { status: 404 });
    }

    // 3. Sipariş durumunu güncelle
    if (status === "success") {
      await prisma.order.update({
        where: { id: merchantOid },
        data: { status: "SUCCESS" }
      });

      if (order.couponId) {
        await prisma.coupon.update({
          where: { id: order.couponId },
          data: { usageCount: { increment: 1 } }
        });
      }
      
      console.log(`PayTR Callback Success: Order ${merchantOid} marked as SUCCESS.`);
    } else {
      await prisma.order.update({
        where: { id: merchantOid },
        data: { status: "FAILED" }
      });
      console.warn(`PayTR Callback Failed: Order ${merchantOid} marked as FAILED. Reason: ${failedReasonMsg} (Code: ${failedReasonCode})`);
    }

    // 4. PayTR'a işlemin başarılı şekilde alındığı bilgisini ("OK" olarak) ilet.
    // DİKKAT: PayTR bu yanıtta tam olarak "OK" metnini düz metin (text/plain) olarak bekler.
    return new Response("OK", { status: 200, headers: { "Content-Type": "text/plain" } });
  } catch (error) {
    console.error("PayTR Callback Handler Error:", error);
    return new Response("FAIL: Internal Server Error", { status: 500 });
  }
}
