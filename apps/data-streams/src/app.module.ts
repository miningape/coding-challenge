import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiController } from './api.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register( [{
      name: 'Worker-Com',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4000
      }
    }] ),
  ],
  
  controllers: [AppController, ApiController],
  providers: [AppService],
})
export class AppModule {}
