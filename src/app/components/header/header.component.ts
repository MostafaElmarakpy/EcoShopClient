import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,               
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchTerm: string = '';

  constructor(public authService: AuthService, private router: Router) {}

  onSearch() {
    const q = this.searchTerm?.trim();
    if (q) {
      this.router.navigate(['/products'], { queryParams: { search: q } });
    } else {
      this.router.navigate(['/products']);
    }
    this.searchTerm = '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
