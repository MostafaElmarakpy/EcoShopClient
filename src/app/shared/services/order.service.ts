import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  items: { productId: number; quantity: number; price: number }[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrderHistory(userId?: number): Observable<Order[]> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId.toString());
    }
    return this.http.get<Order[]>(this.apiUrl, { params }).pipe(
      catchError(this.handleError('fetch order history'))
    );
  }

  createOrder(order: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order).pipe(
      catchError(this.handleError('create order'))
    );
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError(`fetch order ${id}`))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`Error: ${operation}`, error);
      return throwError(() => new Error(`Failed to ${operation}`));
    };
  }
}
