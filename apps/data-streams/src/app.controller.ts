import { Controller, Get, Inject, Param, ParseIntPipe, Redirect, Sse } from '@nestjs/common';
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
   * Starts worker on fixed interval (5 minutes)
   */
  @Get('/start')
  startWorker( ) {
    this.appService.startWorker( 5 );

    return `Started Worker, refreshing connection every 5 minutes` 
  }

  /**
   * Starts worker on a set interval (in minutes)
   */
  @Get('/start/:interval')
  startWorkerInterval(@Param('interval', ParseIntPipe) interval : number): string {    
    this.appService.startWorker( interval );

    return `Started Worker, refreshing connection every ${interval} minutes`; 
  }

  @Get('/stop')
  stopWorker(): string {
    this.appService.stopWorker( );

    return 'Worker Stopped';
  }

  @Get('/error')
  errors(): string {
    return this.appService.getError();
  }
}
