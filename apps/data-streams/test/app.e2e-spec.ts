import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from '../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let appService: AppService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appService = moduleFixture.get<AppService>(AppService);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('\n' +
      '    Welcome to the API endpoint <br />\n' +
      '    GET /data             returns data from the worker <br />\n' +
      '    GET /start            starts the worker with a 5 minute interval <br />\n' +
      '    GET /start/:interval  starts the worker with a refresh rate of :interval minutes (default: 5 minutes) <br />\n' +
      '    GET /stop             stops the worker  <br />\n' +
      '    GET /error            displays any errors encountered by the Server/Worker\n' +
      '    <br /><br />\n' +
      '    No Errors \n' +
      '    ')
  });

  it('/data (GET) no data', () => {
    return request(app.getHttpServer())
      .get('/data')
      .expect(200)
      .expect('No Data Retrieved Yet')
  });

  it('/data (GET) with data', () => {
    appService.setData('Hello World!');

    return request(app.getHttpServer())
      .get('/data')
      .expect(200)
      .expect('Hello World!');
  });

  it('/start (GET) No Set Interval', () => {
    return request(app.getHttpServer())
      .get('/start')
      .expect(200)
      .expect('Started Worker, refreshing data every 5 minutes');
  });

  it('/start/10 (GET) Set Interval', () => {
    return request(app.getHttpServer())
      .get('/start/10')
      .expect(200)
      .expect('Started Worker, refreshing data every 10 minutes');
  });

  it('/stop (GET)', () => {
    return request(app.getHttpServer())
      .get('/stop')
      .expect(200)
      .expect('Worker Stopped');
  });

  it('/error (GET) No Errors Found', () => {
    return request(app.getHttpServer())
      .get('/error')
      .expect(200)
      .expect('No Errors');
  });

  it('/error (GET) Errors Found', () => {
    appService.startWorker(10);

    return request(app.getHttpServer())
      .get('/error')
      .expect(200)
      .expect('{"errno":-61,"code":"ECONNREFUSED","syscall":"connect","address":"127.0.0.1","port":4000}');
  });
});
