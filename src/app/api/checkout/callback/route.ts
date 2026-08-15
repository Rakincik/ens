import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { Pool } from "pg";

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
        },
      });
      console.log(`Order ${merchant_oid} SUCCESS!`);

      // ==========================================
      // MURO LMS ENTEGRASYONU
      // ==========================================
      const muroDbUrl = process.env.MURO_DATABASE_URL;
      if (muroDbUrl) {
        try {
          console.log("Muro LMS Entegrasyonu başlatılıyor...");
          
          const orderWithItems = await prisma.order.findUnique({
            where: { paymentId: merchant_oid },
            include: {
              user: true,
              orderItems: {
                include: {
                  course: true
                }
              }
            }
          });

          if (orderWithItems && orderWithItems.user) {
            const user = orderWithItems.user;
            const muroPool = new Pool({ connectionString: muroDbUrl });
            
            for (const item of orderWithItems.orderItems) {
              const course = item.course;
              const muroGroupId = course.muroGroupId;

              if (muroGroupId) {
                console.log(`Kurs (${course.title}) için Muro Grup ID bulundu: ${muroGroupId}`);
                
                const email = (user.email || "").trim().toLowerCase();
                
                // 1. Kullanıcı Muro'da var mı?
                const userRes = await muroPool.query(
                  'SELECT "Id" FROM "Users" WHERE LOWER("Email") = $1 LIMIT 1',
                  [email]
                );

                let muroUserId: string;

                if (userRes.rows.length > 0) {
                  muroUserId = userRes.rows[0].Id || userRes.rows[0].id;
                  console.log(`Kullanıcı zaten Muro sisteminde kayıtlı. UserID: ${muroUserId}`);
                } else {
                  // Kullanıcı yoksa yeni kayıt oluştur
                  // Şifre kuralı: soyadı + telefonun son 2 hanesi (tümü küçük harf, Türkçe karakterler temizlenmiş)
                  const rawSurname = (user.surname || "").trim().toLowerCase();
                  const cleanSurname = rawSurname
                    .replace(/ı/g, 'i')
                    .replace(/ğ/g, 'g')
                    .replace(/ü/g, 'u')
                    .replace(/ş/g, 's')
                    .replace(/ö/g, 'o')
                    .replace(/ç/g, 'c');

                  const rawPhone = (user.phone || "").trim().replace(/\D/g, "");
                  const phoneLastTwo = rawPhone.length >= 2 ? rawPhone.slice(-2) : "00";
                  const plainPassword = cleanSurname + phoneLastTwo;
                  
                  const newUserId = crypto.randomUUID();
                  const username = email.split("@")[0] || email;

                  console.log(`Yeni Muro kullanıcısı oluşturuluyor. Şifre kuralı: ${plainPassword}`);

                  await muroPool.query(
                    `INSERT INTO "Users" (
                      "Id", "FirstName", "LastName", "Email", "Username", 
                      "Phone", "PasswordHash", "Role", "IsActive", 
                      "CreatedAt", "IsDeleted", "FailedLoginCount"
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10, $11)`,
                    [
                      newUserId,
                      user.name || "",
                      user.surname || "",
                      email,
                      username,
                      user.phone || null,
                      plainPassword, // Plain text şifre (sakın şifreleme dendi)
                      2, // Student = 2
                      true, // IsActive = true
                      false, // IsDeleted = false
                      0 // FailedLoginCount = 0
                    ]
                  );

                  muroUserId = newUserId;
                  console.log(`Yeni kullanıcı Muro veritabanına eklendi. UserID: ${muroUserId}`);
                }

                // 2. Kullanıcı bu gruba zaten üye mi?
                const memberRes = await muroPool.query(
                  'SELECT "Id" FROM "GroupMembers" WHERE "UserId" = $1 AND "GroupId" = $2 LIMIT 1',
                  [muroUserId, muroGroupId]
                );

                if (memberRes.rows.length > 0) {
                  console.log(`Kullanıcı zaten Muro grubuna (${muroGroupId}) üye.`);
                } else {
                  // Gruba atamasını yap
                  const newMemberId = crypto.randomUUID();
                  await muroPool.query(
                    `INSERT INTO "GroupMembers" (
                      "Id", "UserId", "GroupId", "Role", "Status", "AddedAt"
                    ) VALUES ($1, $2, $3, $4, $5, NOW())`,
                    [
                      newMemberId,
                      muroUserId,
                      muroGroupId,
                      2, // Student = 2
                      "active"
                    ]
                  );
                  console.log(`Kullanıcı Muro grubuna (${muroGroupId}) başarıyla atandı.`);
                }
              }
            }
            
            await muroPool.end();
          }
        } catch (muroError) {
          console.error("Muro LMS Entegrasyon Hatası:", muroError);
        }
      } else {
        console.warn("MURO_DATABASE_URL environment variable is not defined. Muro integration skipped.");
      }
      // ==========================================
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
