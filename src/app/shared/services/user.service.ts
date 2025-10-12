import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IUser } from '../../models/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl.replace(/\/$/, '');
  constructor(private http: HttpClient) {}


  getAllUsers() {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }
 createUser(payload: Partial<IUser>): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/users`, payload);
  }
 updateUser(id: number, payload: Partial<IUser>): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/users/${id}`, payload);
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
  getUserById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }

}
