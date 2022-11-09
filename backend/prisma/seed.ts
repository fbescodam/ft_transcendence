import { PrismaClient, Role } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  
  await prisma.user.create({data: {
    name: "AdminUser",
    password: "penis",
    role: Role.ADMIN,
    channels: { create: [
      {
        role: Role.ADMIN,
        channel: {create: {name: "number2"}}
      },
      {
        role: Role.ADMIN,
        channel: {create: {name: "number3"}}
      },
      {
        role: Role.ADMIN,
        channel: {create: {name: "Global"}}
      }
      ]
  }}});

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