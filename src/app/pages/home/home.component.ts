import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../models/product';
import { ProductService } from '../../shared/services/product.service';
import { environment } from '../../../environments/environment';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule , CommonModule , RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredProducts: IProduct[] = [];
  newArrivals: IProduct[] = [];
  bestSellers: IProduct[] = [];
  private apiUrl = environment.apiUrl;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe((products) => {
      // Get featured products (highest priced products)
      this.featuredProducts = [...products]
        .sort((a, b) => b.price - a.price)
        .slice(0, 4);

      // Get new arrivals (most recent products - assuming you have a dateAdded field)
      this.newArrivals = [...products]
        .sort((a, b) => b.id - a.id) // Using ID as a proxy for recency
        .slice(0, 4);

      // Get best sellers (you might want to add a sales count field in the future)
      this.bestSellers = [...products]
        .sort(() => Math.random() - 0.5) // Random for now, replace with actual sales data later
        .slice(0, 4);
    });
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      return 'assets/images/no-image.png';
    }
    return 'assets/images/iPhone.jpg';
    // return `${this.apiUrl}/api/Products/Images/${encodeURIComponent(imagePath)}`;
  }
}