import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { CartService } from '../../../shared/services/cart.service';
import { SeoService } from '../../../shared/services/seo.service';
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
    private cartService: CartService,
    private seoService: SeoService,
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
        this.seoService.updateSeo({
          title: product.name,
          description: `Buy ${product.name} for $${product.price}. Category: ${product.category}.`,
          ogType: 'product',
          ogImage: this.getImageUrl(product.imagePath),
        });
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Unable to load product details.');
        this.loading.set(false);
      }
    });
  }

  addToCart(): void {
    const p = this.product();
    if (p) {
      this.cartService.addToCart({
        productId: p.id,
        name: p.name,
        price: p.price,
        quantity: 1,
        imagePath: p.imagePath,
      });
    }
  }

  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return 'assets/images/no-image.png';
    }
    const baseHost = environment.apiUrl.replace('/api', '');
    return `${baseHost}${imagePath}`;
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
