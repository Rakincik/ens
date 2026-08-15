const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const setting = await prisma.contentSettings.findUnique({ where: { key: 'corporate_settings' } });
  if (setting) {
    console.log(JSON.stringify(JSON.parse(setting.value), null, 2));
  } else {
    console.log("No corporate_settings found.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
