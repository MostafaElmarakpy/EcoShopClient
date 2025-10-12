import { Component, Inject, Input } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserService } from '../../../shared/services/user.service';
import { IUser } from '../../../models/User';
import { take } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() user?: IUser | null = null;

  form: FormGroup;
  rolesOptions = ['Admin', 'Customer'];

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // roles: [[] as string[], Validators.required],
      isActive: [true]
    });
  }

  ngOnInit() {
    if (this.mode === 'edit' && this.user) {
      this.form.patchValue({
        fullName: this.user.userName,
        email: this.user.email,
        roles: this.user.roles ?? ['Customer'],
        isActive: this.user.isActive
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value;
    if (this.mode === 'edit' && this.user) {
      this.userService.updateUser(this.user.id, payload).pipe(take(1)).subscribe({
        next: () => this.activeModal.close('saved'),
        error: err => console.error('update user error', err)
      });
    } else {
      this.userService.createUser(payload).pipe(take(1)).subscribe({
        next: () => this.activeModal.close('saved'),
        error: err => console.error('create user error', err)
      });
    }
  }
  onRoleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const arr = this.form.get('roles')?.value || [];
    input.checked ? arr.push(input.value) : arr.splice(arr.indexOf(input.value), 1);
    this.form.get('roles')?.setValue(arr);
  }

  cancel() { this.activeModal.dismiss('cancel'); }
}