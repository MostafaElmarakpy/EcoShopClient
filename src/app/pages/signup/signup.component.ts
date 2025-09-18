import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { take } from 'rxjs/operators';

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
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', Validators.required],
    });
  }

  get passwordMismatch(): boolean {
    const p = this.signupForm.get('password')?.value;
    const r = this.signupForm.get('rePassword')?.value;
    return !!(this.signupForm.get('rePassword')?.touched && p !== r);
  }

  onSubmit(): void {
    // reset errors each submit
    this.backendErrors = [];

    // mark touched to show validation errors
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      if (this.passwordMismatch) {
        this.backendErrors.push('Passwords do not match.');
      }
      return;
    }

    if (this.passwordMismatch) {
      this.backendErrors.push('Passwords do not match.');
      return;
    }

    // build a clean payload (adjust keys to match your backend)
   const payload = {
        userName: this.signupForm.value.userName,
        password: this.signupForm.value.password,
        email: this.signupForm.value.email,
        rePassword: this.signupForm.value.rePassword,
        name: this.signupForm.value.userName,
      };

    console.log('Signup payload:', payload);

    this.loading = true;

    this.authService.signup(payload)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          console.log('Signup success:', res);
          this.loading = false;
          // show success toast if you have
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Signup error (component):', err);
          this.loading = false;
          // parse error payload robustly
          if (err?.error) {
            const body = err.error;
            // ModelState style { errors: { Field: ["msg"] } }
            if (body.errors && typeof body.errors === 'object') {
              // this.backendErrors = Object.values(body.errors).flat();
            } else if (Array.isArray(body)) {
              this.backendErrors = body;
            } else if (typeof body === 'string') {
              this.backendErrors = [body];
            } else if (body.message) {
              this.backendErrors = [body.message];
            } else {
              // fallback: stringify
              this.backendErrors = [JSON.stringify(body)];
            }
          } else {
            this.backendErrors = [err?.message || 'Sign up failed'];
          }
        }
      });
  }
}
