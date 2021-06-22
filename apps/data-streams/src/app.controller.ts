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

  @Get('/start')
  startWorker( ) {
    let working = this.appService.startWorker( 5 );

    return working ? `Started Worker, refreshing connection every 5 minutes` 
                   : 'There was a problem, GET /error for more information';
  }

  /**
   * Starts worker on a set interval
   */
  @Get('/start/:interval')
  startWorkerInterval(@Param('interval', ParseIntPipe) interval : number): string {    
    let working = this.appService.startWorker( interval );

    return working ? `Started Worker, refreshing connection every ${interval || 5} minutes` 
                   : 'There was a problem, GET /error for more information';
  }

  @Get('/stop')
  stopWorker(): string {
    let working = this.appService.stopWorker( );

    return working ? 'Worker Stopped'
                   : 'There was a problem, GET /error for more information';
  }

  @Get('/error')
  errors(): string {
    return this.appService.getError();
  }
}
