import { HttpModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

describe('WorkerController', () => {
  let workerController: WorkerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ScheduleModule.forRoot(), // Scheduling/Intervals
        HttpModule,               // External HTTP requests
        ClientsModule.register([{
          name: 'Data-Com',
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: 4001
          }
        }])                       // Client for sending data back
      ],
      controllers: [WorkerController],
      providers: [WorkerService],
    }).compile();

    workerController = app.get<WorkerController>(WorkerController);
  });

  describe('root', () => {
    it('Tests1', () => {
      expect("Hello World!").toBe('Hello World!');
    });
  });
});
