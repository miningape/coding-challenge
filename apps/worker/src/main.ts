import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(WorkerModule, {
    transport: Transport.TCP,
    options: {
      host:'localhost',
      port: 4000
    }
  });

  app.listen(async () => {
    console.log('Worker Microservice Has Started');
  });
}

bootstrap();
