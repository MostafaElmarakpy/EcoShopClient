import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ProductDialogComponent } from './products/product-dialog/product-dialog.component';
import { AdminProductsComponent } from './products/admin-products/admin-products.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminProductsComponent,
    ProductDialogComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    NgbModule,
  ]
})
export class AdminModule { }
