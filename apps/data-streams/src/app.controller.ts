import { Controller, Get, Inject, Param, ParseIntPipe, Redirect } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
  ) {}

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
    return this.appService.getData();
  }

  /**
   * Starts worker on a set interval
   */
  @Get('/start/:interval?')
  startWorker(@Param('interval', ParseIntPipe) interval : number): string {    
    this.appService.startWorker( interval || 5 );

    return `Started Worker, refreshing connection every ${interval || 5} minutes`;
  }

  @Get('/stop')
  stopWorker(): string {
    this.appService.stopWorker( );

    return 'Worker Stopped';
  }
}
