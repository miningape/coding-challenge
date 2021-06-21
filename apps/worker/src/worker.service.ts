import { HttpService, Injectable,Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class WorkerService {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly httpService: HttpService,
    @Inject('Data-Com') private readonly client: ClientProxy
  ) {}

  private readonly logger = new Logger();
  
  startWorker(milliseconds: number) : void {
    this.logger.verbose("Worker Started")

    this.client.connect().then( 
      _     => this.logger.verbose( 'Connected to Data-Stream' ),
      error => this.logger.error( 'Could Not Connect to Data-Stream: ' + error )
    )

    this.retrieveData();

    // Creating our interval, multiply by 60000 to make it in mins
    // Must bind 'this' to callback otherwise it goesout of scope
    const interval = setInterval(this.retrieveData.bind(this), milliseconds * 60000 /4);

    // Stop any current worker
    this.stopWorker()

    // Create interval in the API
    this.schedulerRegistry.addInterval("WORKER", interval);
  }

  stopWorker() : void {
    // Cleanup so intervals can be restarted/changed
    if (this.schedulerRegistry.doesExists( "interval", "WORKER" )) {
      this.logger.verbose( 'Worker Stopped' )
      this.schedulerRegistry.deleteInterval("WORKER");
    }
  }

  /**
   * This actually performs the worker's requests
   * 
   * It is bound to an inverval, and uses the HttpService instance in 'this' class
   */
  retrieveData( ): void {
    this.logger.verbose( 'Retieving Data' );
    // I'm mocking the data, it's just looking at this repository on github and GETting the 'db.json' file in the root directory
    // I did this so I can change the value to test it
    this.httpService.get('https://raw.githubusercontent.com/miningape/coding-challenge/main/db.json').subscribe(
      // When data is recieved it calls this function, so it must transmit the signal back to the data-stream
      data => {
          this.logger.verbose( 'Data Retrieved:\n' + data.data );
          // Should add measures for errors
          this.client.send( {'data-stream': 'send'}, data.data ).subscribe(
            _     => this.logger.verbose( 'Sending Data to Data-Stream' ),
            error => this.logger.error  ( 'Data Failed to send to Data-Stream: ' + error ),
            ()    => this.logger.verbose( 'Data Successfully Sent' )
          );
        },
      error => this.logger.error('Failed to Retrieve Data: ' + error),
      () => this.logger.verbose( 'Retrieved All Data Successfully' )
    );
  }  
}
