import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { IProduct } from '../../models/product';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  query = signal('');
  results = signal<IProduct[]>([]);
  loading = signal(false);
  error = signal('');

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const q = params.get('q')?.trim() ?? '';
      this.query.set(q);
      if (!q) {
        this.results.set([]);
        return;
      }
      this.search(q);
    });
  }

  search(term: string): void {
    this.loading.set(true);
    this.error.set('');
    this.productService.searchProducts(term).subscribe({
      next: (products: IProduct[]) => {
        this.results.set(products);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set((err as Error)?.message ?? 'Search failed');
        this.loading.set(false);
      }
    });
  }
}
