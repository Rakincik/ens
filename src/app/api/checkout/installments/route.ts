import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const merchant_id = (process.env.PAYTR_MERCHANT_ID || "474882").trim();
    const merchant_key = (process.env.PAYTR_MERCHANT_KEY || "Z6TA4Ze5d7kqCbud").trim();
    const merchant_salt = (process.env.PAYTR_MERCHANT_SALT || "bgbC7UqJ5qt4rCWs").trim();

    if (!merchant_id || !merchant_key || !merchant_salt) {
      return NextResponse.json({ error: "PayTR API ayarları eksik." }, { status: 500 });
    }

    // İstek ID: Benzersiz bir numara (microtime mantığıyla Date.now)
    const request_id = Date.now().toString() + Math.floor(Math.random() * 1000).toString();

    // PayTR Taksit Oranları Hash Algoritması
    // Hash dizisi: merchant_id + request_id + merchant_salt
    const hashSTR = merchant_id + request_id + merchant_salt;
    
    // HMAC-SHA256 Token hesaplama (Taksit API dökümanına göre sadece hashSTR şifrelenir)
    const paytr_token = crypto.createHmac("sha256", merchant_key).update(hashSTR).digest("base64");

    const formData = new URLSearchParams();
    formData.append("merchant_id", merchant_id);
    formData.append("request_id", request_id);
    formData.append("paytr_token", paytr_token);

    const paytrRes = await fetch("https://www.paytr.com/odeme/taksit-oranlari", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Node.js/Next.js PayTR Client"
      },
      body: formData.toString(),
    });

    const rawText = await paytrRes.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error("PayTR Taksit JSON Parse Hatası:", rawText);
      return NextResponse.json({ 
        error: "PayTR'dan beklenen JSON yanıtı alınamadı.", 
        rawText: rawText.substring(0, 500) 
      }, { status: 500 });
    }

    if (data.status !== "success") {
      console.error("PayTR Taksit API Başarısız:", data);
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Installment Request Error:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu: " + error?.message }, { status: 500 });
  }
}
