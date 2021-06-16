import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * 
   * @returns The cached data retrieved from the worker
   */
  @Get('/data')
  getData(): string {
    return 'Data Lol';
  }

  /**
   * Starts worker on a set interval
   */
  @Get('/start/:interval?')
  startWorker(@Param() params : any): string {
    return `Started Worker, refreshing connection every ${params.interval || 5} minutes`;
  }

  @Get('/stop')
  stopWorker(): string {
    return 'Worker Stopped';
  }
}
