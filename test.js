const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const course = await prisma.course.findFirst();
    if(!course) return console.log('No course');
    await prisma.course.update({
      where: { id: course.id },
      data: { features: ['A'] }
    });
    console.log('Success Array');
  } catch(e) {
    console.error('Array error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
