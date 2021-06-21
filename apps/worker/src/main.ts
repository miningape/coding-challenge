import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger( 'Worker MAIN' );

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(WorkerModule, {
    transport: Transport.TCP,
    options: {
      host:'localhost',
      port: 4000
    }
  });

  app.listen(async () => {
    logger.log('Worker Microservice Started');
  });
}

bootstrap();
