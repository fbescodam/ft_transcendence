#!/bin/sh

# while ! echo exit | nc ft_transcendence.database 3000; do sleep 5; done
# TODO: make sure this is not needed ^

npx prisma migrate dev --name entrypoint
npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts
npm run start
