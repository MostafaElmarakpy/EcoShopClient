import { ErrorHandler, Injectable, inject } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private notificationService = inject(NotificationService);

  handleError(error: unknown): void {
    const message = this.extractMessage(error);
    this.notificationService.error(message);
    console.error('[GlobalErrorHandler]', error);
  }

  private extractMessage(error: unknown): string {
    if (error instanceof Error) {
      // Filter out Angular-internal noise
      if (error.message?.includes('ExpressionChangedAfterItHasBeenCheckedError')) {
        return '';
      }
      return error.message || 'An unexpected error occurred.';
    }
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred.';
  }
}
