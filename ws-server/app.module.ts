import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
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
  providers: [AppService, MainGateway],
})
export class AppModule {}
