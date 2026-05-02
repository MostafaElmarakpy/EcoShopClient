import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IProduct } from '../../../models/product';
import { ProductService } from '../../../shared/services/product.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products = signal<IProduct[]>([]);
  searchTerm = signal('');
  selectedCategory = signal('');
  sortBy = signal<'name' | 'price' | 'category'>('name');
  sortDir = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  pageSize = signal(9);
  loading = signal(false);
  errorMessage = signal('');
  baseUrl: string = environment.apiUrl;

  filteredProducts = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();

    return this.products()
      .filter(product => {
        const matchesSearch = !search ||
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search);
        const matchesCategory = !category || product.category === category;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const direction = this.sortDir() === 'asc' ? 1 : -1;
        if (this.sortBy() === 'price') {
          return direction * (a.price - b.price);
        }
        if (this.sortBy() === 'category') {
          return direction * a.category.localeCompare(b.category);
        }
        return direction * a.name.localeCompare(b.name);
      });
  });

  pagedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize()));
  });

  categories = computed(() => {
    return Array.from(new Set(this.products().map(p => p.category))).sort();
  });

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.errorMessage.set('');
    const query = {
      page: this.currentPage(),
      pageSize: this.pageSize(),
      search: this.searchTerm(),
      category: this.selectedCategory(),
      sortBy: this.sortBy(),
      sortDir: this.sortDir(),
    };

    this.productService.getProducts(query).subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error?.message ?? 'Unable to load products');
        this.loading.set(false);
      }
    });
  }

  navigateToDetail(id: number) {
    this.router.navigate(['/product', id]);
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onCategoryChange(value: string) {
    this.selectedCategory.set(value);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onSort(sortBy: 'name' | 'price' | 'category') {
    if (this.sortBy() === sortBy) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(sortBy);
      this.sortDir.set('asc');
    }
    this.loadProducts();
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      return 'assets/images/no-image.png';
    }
    const baseHost = this.baseUrl.replace('/api', '');
    return `${baseHost}${imagePath}`;
  }
}
