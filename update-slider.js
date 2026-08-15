const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slides = [];
  
  for(let i = 1; i <= 9; i++) {
    slides.push({
      title: `Slider Başlık ${i}`,
      subtitle: "Slider açıklama metni buraya gelecek...",
      buttonText: "Hemen İncele",
      buttonLink: "#kurslar",
      image: `/slider/${i}.png`
    });
  }

  // Also include the hashed image if they want? They said numbered.
  // 9 images.
  
  const newValue = JSON.stringify(slides);
  
  await prisma.contentSettings.upsert({
    where: { key: 'slider' },
    update: { value: newValue },
    create: { key: 'slider', value: newValue }
  });
  
  console.log("Slider güncellendi!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
