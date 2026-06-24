import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { SocketModule } from '@/socket/socket.module';
@Module({
  imports: [SocketModule],
  providers: [CronService],
})
export class CronModule {}