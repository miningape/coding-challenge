import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('Worker-Com') private client: ClientProxy,
  ){
    client.connect()
      .then(
        (data)  => this.logger.verbose( 'Successfully Connected to Worker: ' + data ),
        (error) => this.logger.error( 'Worker Connection Rejected: ' + error )
      )
  }

  // I dont like the idea of saving the data in a variable
  // Maybe nestjs cache would be a better solution
  // This was simple/fast to do, which is why I chose it
  // Not very extendable, so other data sources would need to be saved in another variable (one of the problems with this)
  private data: any;

  private readonly logger = new Logger();

  getHello(): string {
    return (`Welcome to the API endpoint <br />
    GET /data            returns data from the worker <br />
    GET /start/?:interval starts the worker with a refresh rate of :interval minutes (default: 5 minutes) <br />
    GET /stop            stops the worker`);
  }

  setData( data: any ): void {
    this.logger.verbose( 'Saved Data' );
    this.data = data;
  }

  getData(): any {
    this.logger.verbose( 'Retrieved Data' );
    return this.data;
  }

  startWorker( interval: number ): void {
    this.client.send( {worker: 'start'}, interval ).subscribe( 
      data  => this.logger.verbose( 'Request to Start Worker Sent, Recieved: ' + data ),
      error => this.logger.error  ( 'Request to Start Worker Failed, Error: ' + error ),                         
      ()    => this.logger.verbose( 'Request to Start Worker Complete' ) 
    );
  }

  stopWorker( ): void {
    this.client.send( {worker: 'stop'}, {} ).subscribe( 
      data  => this.logger.verbose( 'Request to Stop Worker Sent, Recieved: ' + data ),
      error => this.logger.error  ( 'Request to Stop Worker Failed, Error: ' + error ),                         
      ()    => this.logger.verbose( 'Request to Stop Worker Complete' ) 
    );
  }

}
