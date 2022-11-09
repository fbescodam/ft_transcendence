#!/bin/sh

npx prisma migrate deploy
npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts
npm run start