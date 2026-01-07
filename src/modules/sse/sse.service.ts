import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Observable, Subject, interval, Subscription } from 'rxjs';
import { MessageEvent } from '@nestjs/common';

@Injectable()
export class SseService {
  private eventSubjects = new Map<string, Subject<MessageEvent>>();
  private heartbeatSubscriptions = new Map<string, Subscription>();
  private readonly logger = new Logger(SseService.name);

  createEventStream(userId: string): Observable<MessageEvent> {
    if (!this.eventSubjects.has(userId)) {
      const subject = new Subject<MessageEvent>();
      this.eventSubjects.set(userId, subject);
      this.startHeartbeat(userId);
    }

    return (this.eventSubjects.get(userId) as Subject<MessageEvent>).asObservable();
  }

  handleDisconnect(userId: string): void {
    this.removeUserConnection(userId);
  }

  sendDataToUser(userId: string, data: any): void {
    const subject = this.eventSubjects.get(userId);
    if (subject) {
      subject.next({
        data: JSON.stringify(data),
      });
    }
  }

  broadcast(data: any): void {
    const message = {
      data: JSON.stringify(data),
    };
    this.eventSubjects.forEach((subject) => {
      subject.next(message);
    });
  }

  removeUserConnection(userId: string): void {
    const subject = this.eventSubjects.get(userId);
    if (subject) {
      subject.complete();
      this.eventSubjects.delete(userId);
    }

    const heartbeatSub = this.heartbeatSubscriptions.get(userId);
    if (heartbeatSub) {
      heartbeatSub.unsubscribe();
      this.heartbeatSubscriptions.delete(userId);
    }
  }

  broadcastHourlyTime(): void {
    const now = new Date();
    const timeData = {
      type: 'hourly_time',
      timestamp: now.getTime(),
      time: now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      message: '当前整点时间',
    };

    this.logger.log(`Broadcasting hourly time to ${this.eventSubjects.size} users: ${timeData.time}`);
    this.broadcast(timeData);
  }

  private startHeartbeat(userId: string): void {
    if (this.heartbeatSubscriptions.has(userId)) {
      return;
    }

    const subscription = interval(1000 * 60).subscribe(() => {
      const subject = this.eventSubjects.get(userId);
      if (subject) {
        subject.next({
          type: 'heartbeat',
          data: 'heartbeat',
          retry: 2000, // 客户端将在断开连接后等待2秒再重连
          id: Date.now().toString(),
        });
      }
    });

    this.heartbeatSubscriptions.set(userId, subscription);
  }

  @Cron(CronExpression.EVERY_HOUR)
  handleHourlyBroadcast(): void {
    this.broadcastHourlyTime();
  }
}