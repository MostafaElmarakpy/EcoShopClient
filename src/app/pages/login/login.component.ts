import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl ,FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule ,CommonModule ,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  implements OnInit {
  loginForm!: FormGroup;
  loginErr = 'Invalid email and or password.';
  backendErrors: string[] = [];
  baseUrl: string = 'https://localhost:5001/api/auth/';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit(): void {
    if (this.authService.hasToken()) {
      this.router.navigate(['/home']);
    }
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
      .subscribe({    
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/home']);
        }
        ,        error: (error) => {
          console.error('Login failed:', error);
          this.backendErrors = [];
          this.backendErrors.push(this.loginErr);
        }
      });
          
    }else {
      this.loginForm.markAllAsTouched();
      Object.keys(this.loginForm.controls).forEach((control) =>
        this.loginForm.controls[control].markAsDirty()
      );
    }
  }
}
