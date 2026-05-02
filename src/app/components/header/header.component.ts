import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { ThemeService } from '../../shared/services/theme.service';
import { IUser } from '../../models/User';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  user: IUser | null = null;
  isAdmin = false;
  loginDisplay = false;
  profilePictureUrl = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginDisplay = this.authService.hasToken();

    this.searchControl.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.router.navigate(['/search'], { queryParams: { q: value } });
      });

    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
        this.loginDisplay = !!user || this.authService.hasToken();
        this.profilePictureUrl =
          (user as any)?.profileImageUrl ||
          (user as any)?.profilePictureUrl ||
          '';

        if (user?.roles && Array.isArray(user.roles)) {
          this.isAdmin = user.roles.includes('Admin');
        } else {
          this.isAdmin = false;
        }
      });
  }

  loginRedirect() {
    localStorage.setItem('redirectStartPage', this.router.url || '/');
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  editProfile() {
    this.router.navigate(['/user/update-profile']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
