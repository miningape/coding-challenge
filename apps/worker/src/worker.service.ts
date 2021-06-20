import { HttpService, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class WorkerService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private httpService: HttpService
  ) {}
  
  startWorker(milliseconds: number) : void {
    let callback = () => {
      this.retrieveData( this.httpService );
    }

    this.retrieveData( this.httpService );

    // Creating our interval, multiply by 60000 to make it in mins
    const interval = setInterval(callback, milliseconds * 60000 /4);

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

  retrieveData( http: HttpService ) {
    console.log(`Interval worker executing at time ()!`);
    http.get('https://raw.githubusercontent.com/miningape/coding-challenge/main/db.json').subscribe(
      (data) => console.log(data.data),
      (e) => console.log("Error: ", e),
      () => console.log("Done")
    );
  }



  getHello(): string {
    return 'Hello World!';
  }

  
}
