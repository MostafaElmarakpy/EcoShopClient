import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { IUser } from '../../models/User';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Reactive search control
  searchControl = new FormControl('');
  // local state used with @if blocks
  user: IUser| null = null;
  isAdmin: boolean = false;
  loginDisplay = false;
  profilePictureUrl = '';
 

  private readonly destroy$ = new Subject<void>();

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginDisplay = this.authService.hasToken();

    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.router.navigate(['/search'], { queryParams: { q: value } });
      });

    // Subscribe to user data (user$) to pick roles/profile image
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          // adapt to your IUser shape — try common property names
          this.profilePictureUrl =
            (user as any).profileImageUrl ||
            (user as any).profilePictureUrl ||
            '';
            this.loginDisplay = true;

          // derive isAdmin from common shapes
          if ((user as any).roles && Array.isArray((user as any).roles)) {
            this.isAdmin = (user as any).roles.includes('Admin');
          } else if ((user as any).role && typeof (user as any).role === 'string') {
            this.isAdmin = (user as any).role === 'Admin';
          } else if ((user as any).claims && Array.isArray((user as any).claims)) {
            this.isAdmin = (user as any).claims.some(
              (c: any) =>
                (c.type?.toLowerCase?.() || '').includes('role') && c.value === 'Admin'
            );
          } else {
            this.isAdmin = false;
          }
        } else {
          this.profilePictureUrl = '';
          this.isAdmin = false;
          this.loginDisplay = false;
        }
      });
  }

  // Redirect to login page (no popup)
  loginRedirect() {
    // store return url to potentially use after successful login
    localStorage.setItem('redirectStartPage', this.router.url || '/');
    this.router.navigate(['/login']);
  }

  // Logout -> uses AuthService.logout then navigate
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  editProfile() {
    this.router.navigate(['/user/update-profile']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
