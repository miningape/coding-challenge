import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('Worker-Com') private client: ClientProxy,
  ){
    client.connect()
      .then(
        (data)  => {
          this.logger.verbose( 'Successfully Connected to Worker: ' + data )
          this.connected = true;
        },
        (error) => {
          this.logger.error( 'Worker Connection Rejected: ' + error )
          this.error = error;
        }
      )
  }

  // I dont like the idea of saving the data in a variable
  // Maybe nestjs cache would be a better solution
  // This was simple/fast to do, which is why I chose it
  // Not very extendable, so other data sources would need to be saved in another variable (one of the problems with this)
  private data: any;

  private connected: boolean = false;
  private error: any;

  private readonly logger = new Logger();

  getHello(): string {
    return (`
    ${this.connected ? '' : 'CANNOT CONNECT TO WORKER: SERVICE UNAVAILABLE, GET /error for more info <br />'}
    Welcome to the API endpoint <br />
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
    return this.data || "Nothing Yet";
  }

  getError(): any {
    if ( this.connected ) {
      return "No Errors"
    } else {
      return this.error;
    }
  }

  startWorker( interval: number ): boolean {
    this.client.send( {worker: 'start'}, interval ).subscribe( 
      data  => {
        this.logger.verbose( 'Request to Start Worker Sent, Recieved: ' + data );
        this.connected = true; // Really ugly/redundant, want a better way for this to be done
        // Could include proper data reception method here
      },
      error => {
        this.logger.error  ( 'Request to Start Worker Failed, Error: ' + error );
        this.connected = false;
        this.error = error;
      },                         
      ()    => this.logger.verbose( 'Request to Start Worker Complete' ) 
    );

    return this.connected
  }

  stopWorker( ): boolean {
    this.client.send( {worker: 'stop'}, {} ).subscribe( 
      data  => {
        this.logger.verbose( 'Request to Stop Worker Sent, Recieved: ' + data );
        this.connected = true;
        // Could include proper data reception method here
      },
      error => {
        this.logger.error  ( 'Request to Stop Worker Failed, Error: ' + error )
        this.connected = false;
        this.error = error;
      },                         
      ()    => this.logger.verbose( 'Request to Stop Worker Complete' ) 
    );

    return this.connected;
  }

}
