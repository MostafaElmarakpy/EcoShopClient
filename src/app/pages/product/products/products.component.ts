import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IProduct } from '../../../models/product';
import { ProductService } from '../../../shared/services/product.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  products:IProduct[] = [];

  filteredProducts:IProduct[] = [];
  baseUrl: string = environment.apiUrl;
  constructor(
    private productService: ProductService,
    private router: Router,
  ) {
}
  ngOnInit() {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = data;
    });
  }
  getImageUrl(imagePath: string): string {
    return `${this.baseUrl}/Products/Images/${encodeURIComponent(
      imagePath
    )}`;
  }
  viewDetails(productId: number) {
    this.router.navigate(['/product', productId]);
  }
  filterProducts(searchTerm: string) {
    if (!searchTerm) {
      this.filteredProducts = this.products;
    } else {
      const lowerCaseTerm = searchTerm.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(lowerCaseTerm) 
      );
    }
  }
  navigateToDetail(id: string) {
  this.router.navigate(['/products', id]);
}
  
}