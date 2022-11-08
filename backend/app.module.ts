import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainGateway } from './main.gateway';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService, MainGateway], //need to add, dependencies in here, in the imports, and on top of the file GOOD FUCKING JOB NESTJS
})
export class AppModule {}
