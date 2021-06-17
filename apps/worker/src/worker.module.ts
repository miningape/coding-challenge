import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    ScheduleModule.forRoot() // Needed for scheduling activities
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
