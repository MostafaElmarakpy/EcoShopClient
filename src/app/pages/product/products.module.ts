import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { ConfirmModalComponent } from "../../components/confirm-modal/confirm-modal.component";
import { ProductsRoutingModule } from "./products-routing.module";
// import { DetailProductComponent } from "./detail-product/detail-product.component";



@NgModule({
  declarations: [
  // DeleteProductComponent,

  ],
  imports: [CommonModule, ProductsRoutingModule,ReactiveFormsModule],
  // exports: [ConfirmModalComponent],
})
export class ProductsModule { }

