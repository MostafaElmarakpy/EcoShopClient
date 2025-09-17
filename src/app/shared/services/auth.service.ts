import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login(username: string, password: string) {
    // return this.http.post<any>(`${environment.apiBaseUrl}/auth/login`, { username, password })
    //   .pipe(tap(res => {
    //     this.tokenStorage.saveAccessToken(res.accessToken);
    //     this.tokenStorage.saveRefreshToken(res.refreshToken);
    //     // maybe get user profile
    //   }));
       }

  refreshToken() {
    // const refresh = this.tokenStorage.getRefreshToken();
    // return this.http.post<any>(`${environment.apiBaseUrl}/auth/refresh`, { refreshToken: refresh })
    //   .pipe(tap(res => {
    //     this.tokenStorage.saveAccessToken(res.accessToken);
    //   }));
  }

  logout() {
    // this.tokenStorage.clear();
    // this.userSubject.next(null);
