import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  backendErrors: string[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      // id not required as a form control unless you need it
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get passwordMismatch(): boolean {
    const p = this.signupForm.get('password')?.value;
    const r = this.signupForm.get('rePassword')?.value;
    return !!(this.signupForm.get('rePassword')?.touched && p !== r);
  }

  onSubmit(): void {
    this.backendErrors = [];
    if (this.signupForm.valid && !this.passwordMismatch) {
      const payload = {
        userName: this.signupForm.value.userName,
        password: this.signupForm.value.password,
        email: this.signupForm.value.email,
        rePassword: this.signupForm.value.rePassword,
        name: this.signupForm.value.userName,
      };

      this.authService.signup(payload).subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          // normalize backend error messages
          if (err?.error) {
            if (Array.isArray(err.error)) {
              this.backendErrors = err.error;
            } else if (typeof err.error === 'string') {
              this.backendErrors = [err.error];
            } else if (err.error.errors) {
              this.backendErrors = Object.values(err.error.errors);
            } else {
              this.backendErrors = [JSON.stringify(err.error)];
            }
          } else {
            this.backendErrors = ['Signup failed. Please try again.'];
          }
        },
      });
    } else {
      // mark all controls as touched to show validations
      Object.values(this.signupForm.controls).forEach((c) => c.markAsTouched());
      if (this.passwordMismatch) {
        this.backendErrors = ['Passwords do not match.'];
      } else {
        this.backendErrors = ['Form is not valid'];
      }
    }
  }
}
