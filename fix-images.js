const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting DB url cleanup...");
  
  // Fix Courses
  const courses = await prisma.course.findMany({
    where: {
      image: {
        contains: 'toa.muro.click',
      },
    },
  });

  let updatedCourses = 0;
  for (const course of courses) {
    if (course.image) {
      const newImage = course.image.replace('https://toa.muro.click', '');
      await prisma.course.update({
        where: { id: course.id },
        data: { image: newImage },
      });
      updatedCourses++;
    }
  }
  console.log(`Updated ${updatedCourses} courses.`);

  // Fix ContentSettings (like slider, achievements etc)
  const settings = await prisma.contentSettings.findMany();
  let updatedSettings = 0;
  for (const s of settings) {
     if (s.value.includes('toa.muro.click')) {
        const newVal = s.value.replace(/https:\/\/toa\.muro\.click/g, '');
        await prisma.contentSettings.update({
           where: { key: s.key },
           data: { value: newVal }
        });
        updatedSettings++;
     }
  }
  console.log(`Updated ${updatedSettings} content settings.`);
  console.log("Cleanup finished.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
