import { Injectable } from '@nestjs/common';
import { Observable, Subject, interval, Subscription } from 'rxjs';
import { MessageEvent } from '@nestjs/common';

@Injectable()
export class SseService {
  private eventSubjects = new Map<string, Subject<MessageEvent>>();
  private heartbeatSubscriptions = new Map<string, Subscription>();

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

  private startHeartbeat(userId: string): void {
    if (this.heartbeatSubscriptions.has(userId)) {
      return;
    }

    const subscription = interval(1000 * 60).subscribe(() => {
      const subject = this.eventSubjects.get(userId);
      if (subject) {
        subject.next({
          data: 'heartbeat',
          id: Date.now().toString(),
        });
      }
    });

    this.heartbeatSubscriptions.set(userId, subscription);
  }
}