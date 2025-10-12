import { Injectable } from '@angular/core';
import { IUser } from '../../models/User';
import { AuthService } from './auth.service';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private userRole = new BehaviorSubject<'admin' | 'customer' | null>(null);
  
  userRole$ = this.userRole.asObservable();
  
  constructor(private authService: AuthService) {
    this.authService.user$.pipe(
      map(user => this.determineUserRole(user))
    ).subscribe(role => this.userRole.next(role));
  }

  private determineUserRole(user: IUser | null): 'admin' | 'customer' | null {
    if (!user) return null;
    return user.roles?.includes('Admin') ? 'admin' : 'customer';
  }
}