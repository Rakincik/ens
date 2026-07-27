import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in .env file.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding started...");

  // 1. Temizlik (Tabloları temizle)
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.contentSettings.deleteMany({});

  // 2. Admin Kullanıcısı Oluştur
  const adminPasswordHash = await bcrypt.hash("admin12345", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@turkceoabtdeyiz.com",
      passwordHash: adminPasswordHash,
      name: "Rüstem",
      surname: "Hoca",
      role: "ADMIN",
    },
  });
  console.log("Admin user created: admin@turkceoabtdeyiz.com / admin12345");

  // 3. Test Öğrencisi Oluştur
  const studentPasswordHash = await bcrypt.hash("ogrenci12345", 10);
  const student = await prisma.user.create({
    data: {
      email: "ogrenci@email.com",
      passwordHash: studentPasswordHash,
      name: "Ahmet",
      surname: "Yılmaz",
      role: "STUDENT",
    },
  });
  console.log("Student user created: ogrenci@email.com / ogrenci12345");

  // 4. Eğitimleri/Ürünleri Oluştur
  const course1 = await prisma.course.create({
    data: {
      title: "Türkçe ÖABT Canlı Ders Paketi (2026)",
      description: "Türkçe Öğretmenliği Alan Bilgisi sınavına hazırlık için 250+ saat canlı ders, PDF dökümanlar, haftalık çalışma programları ve rehberlik desteği.",
      price: 4200.00,
      isActive: true,
      isCouponEligible: true,
      image: null,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: "Edebiyat ÖABT Canlı Ders Paketi (2026)",
      description: "Türk Dili ve Edebiyatı Öğretmenliği Alan Bilgisi sınavına hazırlık için 300+ saat canlı ders, video kayıtları, özgün deneme sınavları ve soru çözümleri.",
      price: 4500.00,
      isActive: true,
      isCouponEligible: true,
      image: null,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: "Dil Bilgisi & Anlam Bilgisi Kampı",
      description: "ÖABT ve KPSS sınavlarında çıkan tüm dil bilgisi konularının detaylı anlatımı ve soru çözüm stratejileri içeren 40 saatlik video ders paketi.",
      price: 950.00,
      isActive: true,
      isCouponEligible: true,
      image: null,
    },
  });

  const course4 = await prisma.course.create({
    data: {
      title: "Türkçe ÖABT 10'lu Online Deneme Sınavı",
      description: "ÖSYM formatında hazırlanmış, tamamı video çözümlü 10 adet Türkçe ÖABT online deneme sınavı. Türkiye geneli sıralama analizi ile.",
      price: 650.00,
      isActive: true,
      isCouponEligible: false, // Kupon kullanımına KAPALI ürün
      image: null,
    },
  });

  const course5 = await prisma.course.create({
    data: {
      title: "ALANDA ÖNCÜ - Dört Temel Beceri Konu Anlatımı (Kitap)",
      description: "Öğretmenlik Alan Bilgisi Sınavı (ÖABT) Türkçe alanında çıkacak dört temel beceri konularına özel, sınav odaklı özgün konu anlatımlı kitap.",
      price: 350.00,
      isActive: true,
      isCouponEligible: true,
      image: null,
    },
  });

  const course6 = await prisma.course.create({
    data: {
      title: "ALANDA ÖNCÜ - Çağlayan Edebiyat Soru Bankası (Kitap)",
      description: "Türkçe ve Türk Dili ve Edebiyatı ÖABT sınavları için tamamı çözümlü, özgün ve ÖSYM ayarında edebiyat soru bankası kitabı.",
      price: 380.00,
      isActive: true,
      isCouponEligible: true,
      image: null,
    },
  });

  const course7 = await prisma.course.create({
    data: {
      title: "ALANDA ÖNCÜ - Muhteşem İkili Branş Denemeleri (Kitap)",
      description: "12x25 Dil Bilgisi ve 12x25 Dil Bilimi toplam 600 özgün sorudan oluşan alanında en çok tercih edilen branş denemeleri kitabı.",
      price: 290.00,
      isActive: true,
      isCouponEligible: true,
      image: null,
    },
  });
  console.log("Courses and Publications seeded successfully.");

  // 5. Kuponları Oluştur
  await prisma.coupon.create({
    data: {
      code: "HOŞGELDİN100",
      discountType: "AMOUNT",
      discountValue: 100.00, // 100 TL indirim
      courseId: null, // Genel sepet kuponu
      isActive: true,
      expiryDate: new Date("2030-12-31"),
    },
  });

  await prisma.coupon.create({
    data: {
      code: "EDEBİYAT20",
      discountType: "PERCENTAGE",
      discountValue: 20, // %20 indirim
      courseId: course2.id, // Sadece Edebiyat paketine özel kupon
      isActive: true,
      expiryDate: new Date("2030-12-31"),
    },
  });
  console.log("Coupons seeded successfully.");

  // 6. CMS İçerik Ayarlarını Oluştur (ContentSettings)
  // FAQ SSS Ayarı
  await prisma.contentSettings.create({
    data: {
      key: "faq",
      value: JSON.stringify([
        {
          q: "Dersleri sonradan tekrar izleyebilir miyim?",
          a: "Evet, tüm canlı derslerimiz yayın bittikten hemen sonra sisteme yüklenir. Sınav gününe kadar sınırsız kez geriye dönük izleyebilirsiniz."
        },
        {
          q: "Dökümanlar ve PDF kaynaklar adrese gönderiliyor mu?",
          a: "Eğitim paketlerimize dahil olan PDF dökümanları dijital olarak öğrenci panelinize yüklenir. Kitap veya fiziksel yayın gönderimleri ürün açıklamalarında ayrıca belirtilir."
        },
        {
          q: "Ödemelerde taksit imkanı var mı?",
          a: "PayTR güvenli ödeme altyapımız sayesinde tüm banka ve kredi kartlarına 12 aya varan taksit seçenekleriyle ödeme yapabilirsiniz."
        },
        {
          q: "Kupon kodlarını nasıl kullanırım?",
          a: "Kupon kodunuzu sepet çekmecesinde veya satın alma aşamasındaki kupon girişi alanına yazıp 'Uygula' butonuna basarak sepetinize yansıtabilirsiniz."
        }
      ])
    }
  });

  // Slider Ayarı
  await prisma.contentSettings.create({
    data: {
      key: "slider",
      value: JSON.stringify([
        {
          title: "Türkçe ÖABT'de Türkiye'nin En Seçkin Eğitmen Kadrosu",
          subtitle: "ÖSYM formatında güncel canlı dersler, konu anlatımları ve soru çözüm kampları.",
          buttonText: "Eğitimleri İncele",
          buttonLink: "#kurslar"
        },
        {
          title: "Derece Yapan Öğrencilerin Tercihi",
          subtitle: "Geçen yıl Türkiye derecesi yapan onlarca Türkçe öğretmeni sınav sürecini bizimle tamamladı.",
          buttonText: "Başarılarımızı Gör",
          buttonLink: "/basarilarimiz"
        }
      ])
    }
  });

  // Başarılar/Dereceler Ayarı
  await prisma.contentSettings.create({
    data: {
      key: "achievements",
      value: JSON.stringify([
        { name: "Merve K.", rank: "Türkiye 4.sü", year: "2025 KPSS", comment: "Hocalarımın ilgisi ve dökümanların kalitesi sayesinde bu başarıyı elde ettim." },
        { name: "Selin Y.", rank: "Türkiye 12.si", year: "2025 KPSS", comment: "Canlı ders sonrasındaki soru-cevap saatleri eksiklerimi kapatmamda çok etkili oldu." },
        { name: "Kadir T.", rank: "Türkiye 27.si", year: "2024 KPSS", comment: "Dil bilgisi kampları ve online deneme sınavları tam ÖSYM ayarındaydı." }
      ])
    }
  });

  // Öğretmen Kadrosu Ayarı
  await prisma.contentSettings.create({
    data: {
      key: "teachers",
      value: JSON.stringify([
        { name: "Rüstem Hoca", title: "Dil Bilgisi ve Alan Eğitimi Uzmanı", bio: "12 yıllık ÖABT tecrübesiyle, sınavda çıkan tüm dil bilgisi konularının ve alan eğitimi yöntemlerinin mimarı." },
        { name: "Ömer Hoca", title: "Edebiyat ve Alan Bilgisi Uzmanı", bio: "Divan edebiyatından halk edebiyatına, ÖABT sınavının ezber bozan taktikleriyle dersleri eğlenceli kılan eğitmenimiz." },
        { name: "Murat Hoca", title: "Rehberlik ve Motivasyon Danışmanı", bio: "Sınav hazırlık sürecinizde haftalık çalışma planları ve mentörlük desteğiyle her an yanınızda olan rehberimiz." }
      ])
    }
  });

  console.log("CMS content settings seeded successfully.");
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
