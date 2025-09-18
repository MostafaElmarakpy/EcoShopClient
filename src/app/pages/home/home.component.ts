import { Component } from '@angular/core';
import { IProduct } from '../../models/product';
import { ProductService } from '../../shared/services/product.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 products:IProduct[] = [];
   private apiUrl = environment.apiUrl;

  constructor(private productService: ProductService) {

  }

  ngOnInit() {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data
        .sort((a, b) => b.price - a.price) // Sort products by price from high to low
        .slice(0, 8); // Then limit to the first 8 products
    });
  }
  getImageUrl(imagePath: string): string {
    return `${this.apiUrl}/Products/Images/${encodeURIComponent(
      imagePath
    )}`;
  }
}
