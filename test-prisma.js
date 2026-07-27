const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.course.findMany({
  orderBy: [
    { category: { orderIndex: 'asc' } },
    { orderIndex: 'asc' },
    { createdAt: 'desc' }
  ],
  include: {
    category: { select: { name: true } }
  }
}).then(console.log).catch(console.error).finally(() => prisma.$disconnect());
