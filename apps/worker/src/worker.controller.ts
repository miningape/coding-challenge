import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WorkerService } from './worker.service';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @MessagePattern( {cmd: 'start'} )
  startMicroservice(@Payload() data: any ): string {
    console.log( 'Microservice Started for ' + data )
    return 'started'
  }

  @MessagePattern( {cmd: 'stop'} )
  stopMicroservice( data: any ): string {
    return 'Microservice Stopped';
  }
}
