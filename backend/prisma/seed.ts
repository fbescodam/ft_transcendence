import { PrismaClient, Role } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.user.create({data: {
      name: "AdminUser",
      intraId: 80962,
      intraName: "clafoutis",
      avatar: "avatars/adminavatar",
      email: "totally an email",
      channels: { create: [
        {
          role: Role.ADMIN,
          channel: {create: {name: "Global"}}
        }
    ]}}});
  }
  catch (e) {
    console.log("Exception caught in seeding, the DB is probably already seeded");
    console.trace(e);
  }
}

//npx ts-node --compiler-options {\"module\":\"CommonJS\"} seed.ts
// ^ command for seeding the db

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
