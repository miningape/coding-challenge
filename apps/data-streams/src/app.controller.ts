import { Controller, Get, Inject, Param, ParseIntPipe, Redirect } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    @Inject('Worker-Com') private client: ClientProxy
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
    return 'Data Lol';
  }

  /**ß
   * Starts worker on a set interval
   */
  @Get('/start/:interval?')
  startWorker(@Param('interval', ParseIntPipe) interval : number): string {
    //this.client.connect();
    this.client.send( {worker: 'start'}, interval || 5 ).subscribe( 
      data => console.log(data),        // Next
      () => {},                         // Error
      () => { console.log("Started Worker") } // Complete
    );


    return `Started Worker, refreshing connection every ${interval || 5} minutes`;
  }

  @Get('/stop')
  stopWorker(): string {
    this.client.send( {worker: 'stop'}, {} ).subscribe( 
      data => console.log(data),        // Next
      () => {},                         // Error
      () => { console.log("Stopped Worker") } // Complete
    );

    return 'Worker Stopped';
  }
}
