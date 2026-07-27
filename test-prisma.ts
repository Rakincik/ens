import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
    orderBy: [
      { category: { orderIndex: 'asc' } },
      { orderIndex: 'asc' },
      { createdAt: 'desc' }
    ],
    include: {
      category: { select: { name: true } }
    }
  });
  console.log(courses.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
