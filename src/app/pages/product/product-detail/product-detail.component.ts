import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { IProduct } from '../../../models/product';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent {
  product = signal<IProduct | null>(null);
  loading = signal(true);
  error = signal('');

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('Invalid product ID.');
      this.loading.set(false);
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Unable to load product details.');
        this.loading.set(false);
      }
    });
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      return 'assets/images/no-image.png';
    }
    return `${environment.apiUrl}/api/Products/Images/${encodeURIComponent(imagePath)}`;
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  buyNow(): void {
    const product = this.product();
    if (product) {
      this.router.navigate(['/checkout'], {
        queryParams: { productId: product.id }
      });
    }
  }
}
