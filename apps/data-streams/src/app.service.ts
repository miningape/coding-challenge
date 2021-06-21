import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // I dont like the idea of saving the data in a variable
  // Maybe nestjs cache would be a better solution
  // This was simple/fast to do, which is why I chose it
  // Not very extendable, so other data sources would need to be saved in another variable (one of the problems with this)
  private data: any;

  getHello(): string {
    return (`Welcome to the API endpoint <br />
    GET /data            returns data from the worker <br />
    GET /start/?:interval starts the worker with a refresh rate of :interval minutes (default: 5 minutes) <br />
    GET /stop            stops the worker`);
  }

  setData( data: any ): void {
    this.data = data;
  }

  getData(): any {
    return this.data;
  }

}
