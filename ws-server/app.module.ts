import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { AppService } from './app.service';
import { ChatGateway } from './chat.gateway';
import {join} from 'path';

@Module({
  imports: [ 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'ws-server/socket-client'),
    }),
  ],
  // controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
