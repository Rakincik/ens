import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // 1. "Course" tablosuna paymentLink sütunu ekle. Hata verirse sütun zaten vardır, yoksayarız.
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Course" ADD COLUMN "paymentLink" TEXT;`);
      console.log('paymentLink sütunu eklendi.');
    } catch (e: any) {
      console.log('paymentLink sütunu zaten mevcut olabilir:', e.message);
    }

    // 2. Kurs linklerini güncelle
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

    for (const update of updates) {
      // Find course by exact or partial title match (case insensitive if possible, but prisma is strict, so we fetch and filter)
      const courses = await prisma.course.findMany();
      
      const targetCourse = courses.find(c => c.title.trim().toLowerCase() === update.title.trim().toLowerCase());
      
      if (targetCourse) {
        await prisma.course.update({
          where: { id: targetCourse.id },
          // @ts-ignore - Prisma type not generated yet
          data: { paymentLink: update.paymentLink }
        });
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
