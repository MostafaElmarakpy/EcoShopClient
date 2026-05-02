import { Injectable, signal, computed } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private nextId = 0;
  private notificationsSignal = signal<Notification[]>([]);
  notifications = computed(() => this.notificationsSignal());

  show(message: string, type: NotificationType = 'info', duration = 5000): void {
    const id = this.nextId++;
    const notification: Notification = { id, message, type, duration };
    this.notificationsSignal.update(list => [...list, notification]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration ?? 8000);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  dismiss(id: number): void {
    this.notificationsSignal.update(list => list.filter(n => n.id !== id));
  }
}
