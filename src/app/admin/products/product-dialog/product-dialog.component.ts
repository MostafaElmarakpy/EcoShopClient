import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { IProduct } from '../../../models/product';
import { ProductService } from '../../../shared/services/product.service';

@Component({
  selector: 'app-product-dialog',
  standalone: false,
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() product?: IProduct | null = null;

  form: FormGroup;
  selectedFile: File | null = null;
  preview: string | null = null;
  existingImages: string[] = [];
  progress = 0;
  message = '';

  constructor(public activeModal: NgbActiveModal,
     private fb: FormBuilder,
      private productService: ProductService)
  {
    this.form = this.fb.group({
      name: ['', Validators.required],
      productCode: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.mode === 'edit' && this.product) {
      this.form.patchValue({
        name: this.product.name,
        productCode: this.product.productCode,
        price: this.product.price,
        categoryId: this.product.categoryId
      });
      this.existingImages = this.product.imageUrls ? [...this.product.imageUrls] : [];
    }
  }

onFilesChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (ev: any) => this.preview = ev.target.result;
      reader.readAsDataURL(file);
    }
  }

  

removePreview() {
    this.preview = null;
    this.selectedFile = null;
  }
  removeExisting(i: number) { this.existingImages.splice(i,1); }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fd = new FormData();
    const v = this.form.value;
    fd.append('name', v.name);
    fd.append('productCode', v.productCode);
    fd.append('price', String(v.price));
    fd.append('categoryId', v.categoryId);

    // append existing image if any
    if (this.selectedFile) {
      fd.append('file', this.selectedFile, this.selectedFile.name); 
    }

    if (this.mode === 'edit' && this.product) {
      this.productService.updateProductWithImage(this.product.id, fd)
        .pipe(take(1))
        .subscribe(() => this.activeModal.close('saved'));
    } else {
      this.productService.createProductWithImage(fd)
        .pipe(take(1))
        .subscribe(() => this.activeModal.close('saved'));
        
    }
  }


  private handleEvent(evt: HttpEvent<any>) {
    if (evt.type === HttpEventType.UploadProgress) {
      this.progress = Math.round(100 * (evt.loaded / (evt.total ?? 1)));
    } else if (evt.type === HttpEventType.Response) {
      this.activeModal.close('saved');
    }
  }

  cancel() { this.activeModal.dismiss('cancel'); }
}
