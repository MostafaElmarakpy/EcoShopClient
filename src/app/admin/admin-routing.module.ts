import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AdminProductsComponent } from './products/admin-products/admin-products.component';
import { AdminUsersComponent } from './users/admin-users/admin-users.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    // canActivate: [AdminGuard], // ضع الحرس هنا لو موجود
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: AdminProductsComponent },
       { path: 'users', component: AdminUsersComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
