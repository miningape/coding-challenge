import { HttpService, Injectable,Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class WorkerService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private httpService: HttpService,
    @Inject('Data-Com') private client: ClientProxy
  ) {}
  
  startWorker(milliseconds: number) : void {
    this.retrieveData();

    // Creating our interval, multiply by 60000 to make it in mins
    // Must bind 'this' to callback otherwise it goesout of scope
    const interval = setInterval(this.retrieveData.bind(this), milliseconds * 60000 /4);

    // Stop any current worker
    this.stopWorker()

    // Create interval in the API
    this.schedulerRegistry.addInterval("WORKER", interval);
    console.log("Worker Started")
  }

  stopWorker() : void {
    // Cleanup so intervals can be restarted/changed
    if (this.schedulerRegistry.doesExists( "interval", "WORKER" ))
      this.schedulerRegistry.deleteInterval("WORKER");
  }

  /**
   * This actually performs the worker's requests
   * 
   * It is bound to an inverval, and uses the HttpService instance in 'this' class
   */
  retrieveData( ): void {
    console.log(`Interval worker executing at time ()!`);
    // I'm mocking the data, it's just looking at this repository on github and GETting the 'db.json' file in the root directory
    // I did this so I can change the value to test it
    this.httpService.get('https://raw.githubusercontent.com/miningape/coding-challenge/main/db.json').subscribe(
      // When data is recieved it calls this function, so it must transmit the signal back to the data-stream
      (data) => {
        console.log( 'Data Scraped: ', data.data );
        this.client.send( {'data-stream': 'send'}, data.data ).subscribe();
      },
      (e) => console.log("Error: ", e),
      () => console.log("Done")
    );
  }



  getHello(): string {
    return 'Hello World!';
  }

  
}
