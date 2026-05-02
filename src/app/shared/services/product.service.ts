import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
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
    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.sortDir) params = params.set('sortDir', query.sortDir);
    if (query.minPrice != null) params = params.set('minPrice', query.minPrice.toString());
    if (query.maxPrice != null) params = params.set('maxPrice', query.maxPrice.toString());

    return params;
  }

  /**
   * Fetches products with query params.
   * Handles both paginated and flat array responses from the backend.
   */
  getProducts(query?: ProductQuery): Observable<IProduct[]> {
    const params = this.buildParams(query);

    return this.http.get<IProduct[] | PaginatedResponse<IProduct>>(this.apiUrl, { params }).pipe(
      map(response => {
        // Support both paginated wrapper and flat array
        if (Array.isArray(response)) return response;
        return response.items ?? [];
      }),
      catchError(this.handleError('fetch products'))
    );
  }

  /**
   * Fetches products with full pagination metadata.
   */
  getProductsPaginated(query?: ProductQuery): Observable<PaginatedResponse<IProduct>> {
    const params = this.buildParams(query);

    return this.http.get<IProduct[] | PaginatedResponse<IProduct>>(this.apiUrl, { params }).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return {
            items: response,
            totalCount: response.length,
            page: query?.page ?? 1,
            pageSize: query?.pageSize ?? response.length,
            totalPages: 1,
          };
        }
        return response;
      }),
      catchError(this.handleError('fetch products'))
    );
  }

  getAllProducts(): Observable<IProduct[]> {
    return this.getProducts();
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
      console.error(`Error: ${operation}`, error);
      return throwError(() => new Error(`Failed to ${operation}`));
    };
  }
}
