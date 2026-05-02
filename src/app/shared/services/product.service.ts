import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IProduct, PaginatedResponse } from '../../models/product';
import { environment } from '../../../environments/environment';

export interface ProductQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  categoryId?: number;
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

  private buildParams(query?: ProductQuery): HttpParams {
    let params = new HttpParams();
    if (!query) return params;

    if (query.page) params = params.set('page', query.page.toString());
    if (query.pageSize) params = params.set('pageSize', query.pageSize.toString());
    if (query.search) params = params.set('search', query.search);
    if (query.category) params = params.set('category', query.category);
    if (query.categoryId) params = params.set('categoryId', query.categoryId.toString());
    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.sortDir) params = params.set('sortDir', query.sortDir);
    if (query.minPrice != null) params = params.set('minPrice', query.minPrice.toString());
    if (query.maxPrice != null) params = params.set('maxPrice', query.maxPrice.toString());

    return params;
  }

  getProducts(query?: ProductQuery): Observable<IProduct[]> {
    const params = this.buildParams(query);
    return this.http.get<PaginatedResponse<IProduct>>(this.apiUrl, { params }).pipe(
      map(response => response.items ?? []),
      catchError(this.handleError('fetch products'))
    );
  }

  getProductsPaginated(query?: ProductQuery): Observable<PaginatedResponse<IProduct>> {
    const params = this.buildParams(query);
    return this.http.get<PaginatedResponse<IProduct>>(this.apiUrl, { params }).pipe(
      catchError(this.handleError('fetch products'))
    );
  }

  getAllProducts(): Observable<IProduct[]> {
    return this.getProducts({ pageSize: 1000 });
  }

  searchProducts(term: string): Observable<IProduct[]> {
    return this.getProducts({ search: term });
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError(`fetch product ${id}`))
    );
  }

  createProductWithImage(formData: FormData): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, formData).pipe(
      catchError(this.handleError('create product'))
    );
  }

  updateProductWithImage(id: number, formData: FormData): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(this.handleError(`update product ${id}`))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError(`delete product ${id}`))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      return throwError(() => new Error(`Failed to ${operation}`));
    };
  }
}
