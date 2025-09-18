import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../../models/product';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css']
})
export class DetailProductComponent implements OnInit {
  product: IProduct | null = null;
  editForm: FormGroup;
  showEditModal = false;
  loading = false;
  error: string | null = null;
  private id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      // add other controls if needed
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadProduct(this.id);
    } else {
      this.error = 'Product id is missing.';
    }
  }

  private loadProduct(id: string) {
    this.loading = true;
    this.productService.getProductById(id).pipe(take(1)).subscribe({
      next: (product) => {
        this.product = product;
        // Patch the form only if product exists
        if (product) {
          this.editForm.patchValue({
            name: product.name,
            price: product.price
            // patch other fields
          });
        }
        this.loading = false;
      },
      error: (err) => {
        // normalize error
        this.error = err?.error?.message ?? err?.message ?? 'Failed to load product';
        this.loading = false;
      }
    });
  }

  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  updateProduct() {
    if (!this.editForm.valid || !this.id || !this.product) {
      return;
    }
    const updatedProduct: IProduct = { ...this.product, ...this.editForm.value };
    this.productService.updateProduct(this.id, updatedProduct).pipe(take(1)).subscribe({
      next: () => {
        this.product = updatedProduct;
        this.closeEditModal();
      },
      error: (err) => {
        this.error = err?.error?.message ?? err?.message ?? 'Failed to update product';
      }
    });
  }

  confirmDelete() {
    if (!this.id) return;
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(this.id).pipe(take(1)).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => (this.error = err?.error?.message ?? err?.message ?? 'Delete failed')
    });
  }

  getImageUrl(imagePath?: string | null): string {
    // safe handling when imagePath is null/undefined
    if (!imagePath) return `${environment.apiUrl}/assets/no-image.png`;
    return `${environment.apiUrl}/Products/Images/${encodeURIComponent(imagePath)}`;
  }
}
