import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('Worker-Com') private client: ClientProxy,
  ){
    /* I like the auto error reporting for the user, but it causes issues with testing so was removed
    client.connect()
      .then(
        (data)  => {
          this.logger.verbose( 'Successfully Connected to Worker: ' + data )
        },
        (error) => {
          this.logger.error( 'Worker Connection Rejected: ' + error )
          this.error = error;
        }
      )*/
  }

  // I dont like the idea of saving the data in a variable
  // Maybe nestjs cache would be a better solution
  // This was simple/fast to do, which is why I chose it
  // Not very extendable, so other data sources would need to be saved in another variable (one of the problems with this)
  private data: any;
  private error: any;

  private readonly logger = new Logger();

  getHello(): string {
    return (`
    Welcome to the API endpoint <br />
    GET /data             returns data from the worker <br />
    GET /start            starts the worker with a 5 minute interval <br />
    GET /start/:interval  starts the worker with a refresh rate of :interval minutes (default: 5 minutes) <br />
    GET /stop             stops the worker  <br />
    GET /error            displays any errors encountered by the Server/Worker
    <br /><br />
    ${!this.error ? 'No Errors ' : 'It seems like there is an error, GET /error for more info'}
    `);
  }

  setData( data: any ): void {
    this.logger.verbose( 'Saved Data' );
    this.data = data;
  }

  getData(): any {
    this.logger.verbose( 'Retrieved Data' );
    return this.data || "No Data Retrieved Yet";
  }

  getError(): any {
    return this.error || "No Errors";
  }

  startWorker( interval: number ): void {
    this.client.send( {worker: 'start'}, interval ).subscribe( 
      data  => {
        this.logger.verbose( 'Request to Start Worker Sent, Recieved: ' + data );
        this.error = null;
      },
      error => {
        this.logger.error  ( 'Request to Start Worker Failed, Error: ' + error );
        this.error = error;
      },                         
      ()    => this.logger.verbose( 'Request to Start Worker Complete' ) 
    );
  }

  stopWorker( ): void {
    this.client.send( {worker: 'stop'}, {} ).subscribe( 
      data  => {
        this.logger.verbose( 'Request to Stop Worker Sent, Recieved: ' + data );
        this.error = null;
        // Could include proper data reception method here
      },
      error => {
        this.logger.error  ( 'Request to Stop Worker Failed, Error: ' + error )
        this.error = error;
      },                         
      ()    => this.logger.verbose( 'Request to Stop Worker Complete' ) 
    );
  }

}
