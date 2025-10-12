import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && !request.url.includes('/Auth/login') && !request.url.includes('/Auth/register')) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.router.navigate(['/login']);
      return throwError('No refresh token');
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
        this.router.navigate(['/login']);
        return throwError('Refresh failed');
      })
    );
  }
}