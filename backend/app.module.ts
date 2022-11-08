import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainGateway } from './main.gateway';
import {join} from 'path';

@Module({
  imports: [ 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'socket-client'),
    }),
  ],
  // controllers: [AppController],
  providers: [AppService, MainGateway], //need to add, dependencies in here, in the imports, and on top of the file GOOD FUCKING JOB NESTJS
})
export class AppModule {}
