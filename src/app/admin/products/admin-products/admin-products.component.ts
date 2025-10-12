import { Component, OnDestroy, OnInit, inject, TemplateRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IProduct } from '../../../models/product';
import { ProductService } from '../../../shared/services/product.service';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { DialogBoxComponent } from '../../../shared/dialog-box/dialog-box.component';

@Component({
  selector: 'app-admin-products',
  standalone: false,
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private modalService = inject(NgbModal);
  private destroy$ = new Subject<void>();
  productList: IProduct[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadProducts();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.productService.getAllProducts().pipe(takeUntil(this.destroy$)).subscribe({
      next: res => this.productList = res,
      error: err => console.error(err)
    });
  }

  openCreate() {
    const ref = this.modalService.open(ProductDialogComponent, { size: 'lg', backdrop: 'static' });
    ref.componentInstance.mode = 'create';
    ref.closed.subscribe(result => { if (result === 'saved') this.loadProducts(); });
  }

  openEdit(item: IProduct) {
    const ref = this.modalService.open(ProductDialogComponent, { size: 'lg', backdrop: 'static' });
    ref.componentInstance.mode = 'edit';
    ref.componentInstance.product = item;
    ref.closed.subscribe(result => { if (result === 'saved') this.loadProducts(); });
  }

  confirmDelete(id: number) {
    const ref = this.modalService.open(DialogBoxComponent, { centered: true });
    ref.componentInstance.title = 'Confirm Delete';
    ref.componentInstance.message = 'Are you sure you want to delete this product?';
    ref.result.then(r => {
      if (r?.event === 'confirmed') {
        this.productService.deleteProduct(id).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => this.loadProducts(),
          error: e => console.error(e)
        });
      }
    }).catch(()=>{});
  }
}
