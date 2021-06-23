import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';
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

    it('should return "No Data Retrieved Yet" ( setting to null )', () => {
      apiController.recieveData( null );
      expect(appController.getData()).toBe("No Data Retrieved Yet");
    });

    it('should return "No Data Retrieved Yet" not setting', () => {
      expect(appController.getData()).toBe("No Data Retrieved Yet");
    });
  });

  describe('Endpoint Testing', () => {
    it('Should return opening message', () => {
      expect(appController.getHello()).toContain('No Errors');
    });

    it('Should return opening message + error', done => {
      appController.startWorker();

      // I really dont like doing this ( Also causes Jest error I'm really not happy about )
      // But I cant find any info on how to await for an observable with jest
      setTimeout(() => {
        expect(appController.getHello()).toContain('more info');
        done();
      }, 1000);
    });

    it('Should return "No Errors"', () => {
      expect(appController.errors()).toBe("No Errors");
    });

    it('Should return "No Errors"', done => {
      appController.startWorker();

      setTimeout(() => {
        // intanceof doesnt work
        expect(appController.errors()).toHaveProperty('errno');
        done();
      }, 1000);
    });
  });
});
