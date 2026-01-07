import { Controller, Get, Sse, MessageEvent, UseGuards, Logger, Req, OnModuleDestroy } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';
import { JwtQueryAuthGuard } from '@/modules/auth/jwt-query.guard';


@Controller('sse')
@UseGuards(JwtQueryAuthGuard)
export class SseController implements OnModuleDestroy {
  private logger: Logger = new Logger(SseController.name);
  constructor(private readonly sseService: SseService, ) {}


  @Get()
  @Sse()
  sse(@Req() req: any): Observable<MessageEvent> {
    this.logger.log(`Establishing SSE connection for user: ${req.user.id}`);
    const userId = req.user.id;
    const observable = this.sseService.createEventStream(userId);

    return new Observable<MessageEvent>((subscriber) => {
      const subscription = observable.subscribe(subscriber);

      return () => {
        this.logger.warn(`Closing SSE connection for user: ${userId}`);
        subscription.unsubscribe();
        this.sseService.handleDisconnect(userId);
      };
    });
  }

  onModuleDestroy() {
    this.logger.error('SseController destroyed, cleaning up connections');
  }
}