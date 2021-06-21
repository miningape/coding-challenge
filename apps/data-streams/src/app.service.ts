import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
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
