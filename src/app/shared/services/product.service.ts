import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IProduct } from '../../models/product';
import { environment } from '../../../environments/environment';

export interface ProductQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  sortBy?: 'name' | 'price' | 'category' | 'id';
  sortDir?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(query?: ProductQuery): Observable<IProduct[]> {
    let params = new HttpParams();

    if (query?.page) {
      params = params.set('page', query.page.toString());
    }
    if (query?.pageSize) {
      params = params.set('pageSize', query.pageSize.toString());
    }
    if (query?.search) {
      params = params.set('search', query.search);
    }
    if (query?.category) {
      params = params.set('category', query.category);
    }
    if (query?.sortBy) {
      params = params.set('sortBy', query.sortBy);
    }
    if (query?.sortDir) {
      params = params.set('sortDir', query.sortDir);
    }
    if (query?.minPrice != null) {
      params = params.set('minPrice', query.minPrice.toString());
    }
    if (query?.maxPrice != null) {
      params = params.set('maxPrice', query.maxPrice.toString());
    }

    return this.http.get<IProduct[]>(this.apiUrl, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
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

  createProductWithImage(formData: FormData): Observable<IProduct> {
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

  updateProductWithImage(id: number, formData: FormData): Observable<IProduct> {
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

}