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
    let x = this.client.send( {cmd: 'start'}, interval || 5 );
    x.subscribe( data => console.log(data), () => {}, () => { console.log("complete") } );


    return `Started Worker, refreshing connection every ${interval || 5} minutes`;
  }

  @Get('/stop')
  stopWorker(): string {
    return 'Worker Stopped';
  }
}
