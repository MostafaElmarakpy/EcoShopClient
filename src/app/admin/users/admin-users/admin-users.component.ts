import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IUser } from '../../../models/User';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../shared/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogBoxComponent } from '../../../shared/dialog-box/dialog-box.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private modalService = inject(NgbModal);
  private destroy$ = new Subject<void>();

  userList: IUser[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers() {
    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe({
      next: users => this.userList = users,
      error: err => console.error('Error loading users', err)
    });
  }

  openCreate() {
    const ref = this.modalService.open(UserDialogComponent, { size: 'lg', backdrop: 'static' });
    ref.componentInstance.mode = 'create';
    ref.closed.subscribe(result => { if (result === 'saved') this.loadUsers(); });
  }

  openEdit(user: IUser) {
    const ref = this.modalService.open(UserDialogComponent, { size: 'lg', backdrop: 'static' });
    ref.componentInstance.mode = 'edit';
    ref.componentInstance.user = user;
    ref.closed.subscribe(result => { if (result === 'saved') this.loadUsers(); });
  }

  confirmDelete(id: number) {
    const ref = this.modalService.open(DialogBoxComponent, { centered: true });
    ref.componentInstance.title = 'Confirm Delete';
    ref.componentInstance.message = 'Are you sure you want to delete this user?';
    ref.result.then(r => {
      if (r?.event === 'confirmed') {
        this.userService.deleteUser(id).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => this.loadUsers(),
          error: e => console.error('delete user failed', e)
        });
      }
    }).catch(()=>{ /* dismissed */ });
  }
}