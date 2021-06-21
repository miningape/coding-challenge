import { HttpModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Scheduling/Intervals
    HttpModule,               // External HTTP requests
    ClientsModule.register([{
      name: 'Data-Com',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4001
      }
    }])                       // Client for sending data back
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
