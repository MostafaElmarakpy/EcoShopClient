import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';
import { NotificationService } from '../shared/services/notification.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    if (token && !this.isAuthEndpoint(request.url)) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }

        this.handleHttpError(error);
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return throwError(() => new Error('Session expired. Please log in again.'));
    }

    return this.authService.refreshToken().pipe(
      switchMap((response: any) => {
        this.authService.storeTokens(response);
        request = request.clone({
          setHeaders: { Authorization: `Bearer ${response.accessToken}` }
        });
        return next.handle(request);
      }),
      catchError(() => {
        this.authService.logout();
        this.notificationService.warning('Session expired. Please log in again.');
        this.router.navigate(['/login']);
        return throwError(() => new Error('Session expired'));
      })
    );
  }

  private handleHttpError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 0:
        this.notificationService.error('Unable to connect to the server. Please check your network.');
        break;
      case 403:
        this.notificationService.warning('You do not have permission to perform this action.');
        break;
      case 404:
        // Silently handled by components
        break;
      case 500:
        this.notificationService.error('A server error occurred. Please try again later.');
        break;
      default:
        if (error.status >= 400) {
          const msg = this.extractServerMessage(error) || `Request failed (${error.status}).`;
          this.notificationService.error(msg);
        }
    }
  }

  private extractServerMessage(error: HttpErrorResponse): string | null {
    if (typeof error.error === 'string') return error.error;
    if (error.error?.message) return error.error.message;
    if (error.error?.title) return error.error.title;
    return null;
  }

  private isAuthEndpoint(url: string): boolean {
    const lower = url.toLowerCase();
    return lower.includes('/auth/login') || lower.includes('/auth/register');
  }
}
