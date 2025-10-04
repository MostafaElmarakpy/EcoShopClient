import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IUser ,ILogin, IRegister } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl.replace(/\/$/, ''); // remove trailing slash
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userSubject = new BehaviorSubject<IUser | null>(this.readUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

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
    return this.http.post<IUser>(this.buildUrl('Auth/refresh-token'), { token: refreshToken }).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
      }),
      catchError(this.formatErrors)
    );
  }

login(loginUser: ILogin): Observable<IUser> {
   const body = { email: loginUser.email, password: loginUser.password };
  const loginUrl = this.buildUrl('auth/login'); 
  return this.http.post<IUser>(loginUrl, body).pipe(
    tap(response => {
      // store user details and jwt token in local storage
      try {
        localStorage.setItem('user', JSON.stringify(response));
      } catch {}
      this.userSubject.next(response);
      this.isAuthenticatedSubject.next(!!response?.token);
    }),
    catchError(this.formatErrors)
  );
}

signup(registerData: IRegister): Observable<IUser> {
  console.log('Sending signup request with:', registerData);
  const body = {
    userName: (registerData as any).name ?? registerData.name,
    email: registerData.email,
    password: registerData.password,
    confirmPassword: (registerData as any).rePassword ?? registerData.rePassword ?? registerData.password
  };
  const signupUrl = this.buildUrl('auth/register'); 
  return this.http.post<IUser>(signupUrl, body).pipe(
    
    tap(response => 
      {
        // store user details and jwt token in local storage
        try {
          localStorage.setItem('user', JSON.stringify(response));
        } catch {}
        this.userSubject.next(response);
        this.isAuthenticatedSubject.next(!!response?.token);
      }

    ),
    catchError(this.formatErrors)
  );
}

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  hasToken(): boolean {
    const user = this.readUserFromStorage();
    return !!user?.token;
  }


  getAccessToken(): string | undefined {
    const user = this.readUserFromStorage();
   return user?.token;
  }

   getToken(): string | null {
    return localStorage.getItem('token');
  }


  storeTokens(response: { accessToken: string, refreshToken: string }) {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }
  isAuthenticated(): Observable<boolean> {
   return this.isAuthenticatedSubject.asObservable();
  }



  private formatErrors(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      // Backend errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && typeof error.error === 'object') {
        errorMessage += `\nDetails: ${JSON.stringify(error.error)}`;
      } else if (error.error) {
        errorMessage += `\nDetails: ${error.error}`;
      }
    } else {
      errorMessage = `Error: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}