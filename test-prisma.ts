import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
    orderBy: [
      { orderIndex: 'asc' },
      { createdAt: 'desc' }
    ],
    include: {
      categories: { select: { name: true } }
    }
  });
  console.log(courses.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
