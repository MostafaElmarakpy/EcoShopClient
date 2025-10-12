import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  userName: string = 'Admin User'; // Replace with actual user data

  constructor() { 
  }
  ngOnInit(): void {
    // Initialization logic here

  }
  
  toggleSidebar(): void {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('active');
  }
}
