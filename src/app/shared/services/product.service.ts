import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { IProduct } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5234/Products'; // Adjust the URL as needed
  private productDeletionSource = new BehaviorSubject<number | null>(null);
  productDeletion$ = this.productDeletionSource.asObservable();

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        return throwError(() => new Error('Failed to fetch products'));
      })
    );
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching product with id ${id}:`, error);
        return throwError(() => new Error(`Failed to fetch product with id ${id}`));
      })
    );
  }

  createProductWithImage(formData: FormData): Observable<IProduct> { // تحديد نوع الاستجابة
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    return this.http.post<IProduct>(this.apiUrl, formData).pipe(
      catchError(error => {
        console.error('Error creating product:', error);
        return throwError(() => new Error('Failed to create product'));
      })
    );
  }

  updateProductWithImage(id: number, formData: FormData): Observable<IProduct> { // تحديد نوع الاستجابة
    return this.http.put<IProduct>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(error => {
        console.error(`Error updating product with id ${id}:`, error);
        return throwError(() => new Error(`Failed to update product with id ${id}`));
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting product with id ${id}:`, error);
        return throwError(() => new Error(`Failed to delete product with id ${id}`));
      })
    );
  }

  notifyProductDeletion(productId: number) {
    this.productDeletionSource.next(productId);
  }
}