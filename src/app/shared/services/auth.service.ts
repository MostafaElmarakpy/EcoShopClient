import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IUser, ILogin, IRegister } from '../../models/User';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl.replace(/\/$/, ''); // remove trailing slash
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userSubject = new BehaviorSubject<IUser | null>(this.readUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  private readUserFromStorage(): IUser | null {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }

  private buildUrl(path: string) {
    // ensure single slash between base and path
    return `${this.apiUrl}/${path.replace(/^\//, '')}`;
  }

  refreshToken(): Observable<IUser> {
    const refreshToken = this.userSubject.value?.refreshToken;
    if (!refreshToken) return throwError(() => new Error('No refresh token'));
    return this.http.post<IUser>(this.buildUrl('auth/refresh-token'), { token: refreshToken }).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
      }),
      catchError(this.formatErrors)
    );
  }

  login(loginUser: ILogin): Observable<IUser> {
    // adjust path to your backend route
    return this.http.post<IUser>(this.buildUrl('auth/login'), loginUser).pipe(
      tap(response => console.log('Login response:', response)),
      catchError(this.formatErrors)
    );
  }

  signup(registerData: IRegister): Observable<IUser> {
    console.log('Sending signup request with:', registerData);
    // adjust path to your backend route for register
    const signupUrl = this.buildUrl('api/users/auth/register'); 
    return this.http.post<IUser>(signupUrl, registerData).pipe(
      tap((response) => {
        console.log('Signup response:', response);
      }),
      catchError(this.formatErrors)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasToken(): boolean {
    const token = this.getToken();
    return !!token;
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // preserve original HttpErrorResponse so component can inspect error body / status
  private formatErrors = (error: HttpErrorResponse) => {
    console.error('API error:', error);
    return throwError(() => error);
  };
}
