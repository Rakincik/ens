import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { binNumber } = await req.json();

    if (!binNumber || binNumber.length < 6) {
      return NextResponse.json({ error: "Geçersiz BIN numarası" }, { status: 400 });
    }

    const merchant_id = (process.env.PAYTR_MERCHANT_ID || "474882").trim();
    const merchant_key = (process.env.PAYTR_MERCHANT_KEY || "Z6TA4Ze5d7kqCbud").trim();
    const merchant_salt = (process.env.PAYTR_MERCHANT_SALT || "bgbC7UqJ5qt4rCWs").trim();

    if (!merchant_id || !merchant_key || !merchant_salt) {
      return NextResponse.json({ error: "PayTR API ayarları eksik." }, { status: 500 });
    }

    // PayTR BIN Sorgulama Hash Algoritması
    // Hash dizisi: bin_number + merchant_id + merchant_salt
    const hashSTR = binNumber + merchant_id + merchant_salt;
    
    // HMAC-SHA256 Token hesaplama
    const paytr_token = crypto.createHmac("sha256", merchant_key).update(hashSTR).digest("base64");

    const formData = new URLSearchParams();
    formData.append("merchant_id", merchant_id);
    formData.append("bin_number", binNumber);
    formData.append("paytr_token", paytr_token);

    const paytrRes = await fetch("https://www.paytr.com/odeme/api/bin-detail", {
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
      console.error("PayTR JSON Parse Hatası. Gelen Metin:", rawText);
      return NextResponse.json({ 
        error: "PayTR'dan beklenen JSON yanıtı alınamadı.", 
        rawText: rawText.substring(0, 500) 
      }, { status: 500 });
    }

    // DEBUG: PayTR'dan ne cevap dönüyor sunucuda görelim
    console.log("PayTR BIN API Yanıtı:", data);

    if (data.status !== "success") {
      console.error("PayTR BIN API Başarısız:", data);
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("BIN Request Error:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu: " + error?.message, stack: error?.stack }, { status: 500 });
  }
}
