import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WorkerService } from './worker.service';

@Controller()
export class WorkerController {
  constructor(
    private readonly workerService: WorkerService,
  ) {}

  @MessagePattern( {cmd: 'start'} )
  startMicroservice(@Payload() data: string ): string {
    console.log( 'Microservice Started for ' + data )
    this.workerService.startWorker( parseInt( data ) )
    return 'Worker Started'
  }

  @MessagePattern( {cmd: 'stop'} )
  stopMicroservice( data: any ): string {
    this.workerService.stopWorker();
    return 'Worker Stopped';
  }

  
}
