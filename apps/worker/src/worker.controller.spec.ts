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

  describe('Checking Endpoints', () => {
    it('Should return "Worker Started"', () => {
      expect(workerController.startMicroservice( 123 )).toBe("Worker Started");
    });

    it('Should return "Worker Stopped"', () => {
      expect(workerController.stopMicroservice( 123 )).toBe("Worker Stopped");
    });
  });
});
