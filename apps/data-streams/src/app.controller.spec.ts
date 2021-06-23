import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('Controllers', () => {
  let appController: AppController;
  let apiController: ApiController;

  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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
    }).compile();

    appController = app.get<AppController>(AppController);
    apiController = app.get<ApiController>(ApiController);
    
    appService = app.get<AppService>(AppService);
  });

  describe('Data Saving/Retriving', () => {
    it('should return "Hello World!"', () => {
      apiController.recieveData("Hello World!");
      expect(appController.getData()).toBe('Hello World!');
    });

    it('should return "No Data Retrieved Yet"', () => {
      apiController.recieveData( null );
      expect(appController.getData()).toBe("No Data Retrieved Yet");
    });
  });

  describe('Endpoint Testing', () => {
    it('Should return opening message', () => {
      expect(appController.getHello()).toContain('No Errors');
    });

    it('Should return opening message + error', () => {
      appController.startWorker();
      expect(appController.getHello()).toContain('more info');
    })
  });
});
