import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Kurs görselleri güncelleniyor...");
  const courses = await prisma.course.findMany();
  for (const course of courses) {
    if (course.image) {
      let newImage = course.image;
      if (newImage.includes('turkceoabtdeyiz.com')) {
        newImage = newImage.replace(/https:\/\/turkceoabtdeyiz\.com/g, 'https://toa.muro.click');
      }
      if (newImage.startsWith('/uploads/')) {
        newImage = 'https://toa.muro.click' + newImage;
      }
      
      if (newImage !== course.image) {
        await prisma.course.update({
          where: { id: course.id },
          data: { image: newImage }
        });
        console.log(`Güncellendi: ${course.title}`);
      }
    }
  }

  console.log("İçerik ayarları (Eğitmen, Slider vs.) güncelleniyor...");
  const settings = await prisma.contentSettings.findMany();
  for (const setting of settings) {
    let newVal = setting.value;
    let changed = false;
    
    if (newVal.includes('turkceoabtdeyiz.com')) {
      newVal = newVal.replace(/https:\/\/turkceoabtdeyiz\.com/g, 'https://toa.muro.click');
      changed = true;
    }
    
    // Slider resimleri veya uploads vb. için relative path'leri absolute yapmak:
    // Sadece /slider/ veya /uploads/ ile başlayan image linkleri
    if (newVal.includes('"/slider/')) {
      newVal = newVal.replace(/"\/slider\//g, '"https://toa.muro.click/slider/');
      changed = true;
    }
    if (newVal.includes('"/uploads/')) {
      newVal = newVal.replace(/"\/uploads\//g, '"https://toa.muro.click/uploads/');
      changed = true;
    }

    if (changed) {
      await prisma.contentSettings.update({
        where: { key: setting.key },
        data: { value: newVal }
      });
      console.log(`Güncellendi: ContentSettings -> ${setting.key}`);
    }
  }

  console.log("Tüm işlemler başarıyla tamamlandı!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
