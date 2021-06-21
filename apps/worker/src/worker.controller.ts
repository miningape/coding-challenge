import { Controller, HttpService, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { WorkerService } from './worker.service';
@Controller()
export class WorkerController {
  constructor(
    private readonly workerService: WorkerService,
  ) {}

  @MessagePattern( {worker: 'start'} )
  startMicroservice(@Payload() data: number ): string {
    this.workerService.startWorker( data )
    return 'Worker Started'
  }

  @MessagePattern( {worker: 'stop'} )
  stopMicroservice( data: any ): string {
    this.workerService.stopWorker();
    return 'Worker Stopped';
  }
}
