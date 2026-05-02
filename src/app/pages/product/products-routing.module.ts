import { RouterModule,Routes } from "@angular/router";
import { ProductsComponent } from "./products/products.component";
import { NgModule } from "@angular/core";
// import { DetailProductComponent } from "./detail-product/detail-product.component";


const routes: Routes = [
    { path: '', component: ProductsComponent },
    // { path: 'product/:id' },
    { path: 'product', component: ProductsComponent },
      

    { path: '**', redirectTo: 'product' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsRoutingModule { }  