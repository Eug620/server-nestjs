import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [SseController],
  providers: [SseService],
  exports: [SseService],
})
export class SseModule {}