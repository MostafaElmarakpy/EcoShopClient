import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div class="toast-item" [class]="'toast-' + notification.type" role="alert">
          <span class="toast-message">{{ notification.message }}</span>
          <button class="toast-close" (click)="notificationService.dismiss(notification.id)"
                  aria-label="Close">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 400px;
    }
    .toast-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      color: #fff;
      font-size: 0.9rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
    }
    .toast-success { background-color: #2e7d32; }
    .toast-error   { background-color: #c62828; }
    .toast-warning { background-color: #f57f17; color: #333; }
    .toast-info    { background-color: #1565c0; }
    .toast-close {
      background: none;
      border: none;
      color: inherit;
      font-size: 1.25rem;
      cursor: pointer;
      margin-left: 0.75rem;
      line-height: 1;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
  `]
})
export class NotificationToastComponent {
  constructor(public notificationService: NotificationService) {}
}
