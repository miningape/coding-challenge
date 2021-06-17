import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class WorkerService {
  constructor(
    private schedulerRegistry: SchedulerRegistry
  ) {}
  
  startWorker(milliseconds: number) : void {
    // Dummy callback to call retrieveData() with paramss
    const callback = () => {
      this.retrieveData( milliseconds );
    };
  
    // Creating our interval
    const interval = setInterval(callback, milliseconds);

    // Stop any current worker
    this.stopWorker()

    // Create interval in the API
    this.schedulerRegistry.addInterval("WORKER", interval);
  }

  stopWorker() : void {
    // Cleanup so intervals can be restarted/changed
    if (this.schedulerRegistry.doesExists( "interval", "WORKER" ))
      this.schedulerRegistry.deleteInterval("WORKER");
  }

  retrieveData( milliseconds: number ) {
    console.log(`Interval worker executing at time (${milliseconds})!`);
  }



  getHello(): string {
    return 'Hello World!';
  }

  
}
