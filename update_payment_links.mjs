import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Course" ADD COLUMN "paymentLink" TEXT;`);
      console.log('paymentLink sütunu eklendi.');
    } catch (e) {
      console.log('paymentLink sütunu zaten mevcut olabilir:', e.message);
    }

    const updates = [
      {
        title: "2027 ERKEN KAYIT TÜRKÇE ÖABT CANLI DERS PAKETİ",
        paymentLink: "https://www.paytr.com/link/WsyyxKq"
      },
      {
        title: "2027 ERKEN KAYIT TÜRKÇE ÖABT VİDEO DERS PAKETİ",
        paymentLink: "https://www.paytr.com/link/tyPplkh"
      },
      {
        title: "2027 ERKEN KAYIT TÜRKÇE ÖABT + AGS VİDEO DERS PAKETİ",
        paymentLink: "https://www.paytr.com/link/ZFz7aaW"
      },
      {
        title: "2027 ERKEN KAYIT CANLI TÜRKÇE ÖABT + VİDEO AGS",
        paymentLink: "https://www.paytr.com/link/BTi7yrF"
      }
    ];

    // Read existing courses directly with raw SQL to bypass any type caching issues
    const courses = await prisma.$queryRawUnsafe(`SELECT * FROM "Course"`);
    
    for (const update of updates) {
      const targetCourse = courses.find(c => c.title.trim().toLowerCase() === update.title.trim().toLowerCase());
      
      if (targetCourse) {
        await prisma.$executeRawUnsafe(
          `UPDATE "Course" SET "paymentLink" = $1 WHERE "id" = $2`,
          update.paymentLink,
          targetCourse.id
        );
        console.log(`Güncellendi: ${targetCourse.title}`);
      } else {
        console.log(`Kurs bulunamadı: ${update.title}`);
      }
    }
  } catch (error) {
    console.error('Hata oluştu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
