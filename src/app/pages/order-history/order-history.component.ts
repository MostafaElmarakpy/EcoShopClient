import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../shared/services/order.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
})
export class OrderHistoryComponent {
  orders = signal<Order[]>([]);
  loading = signal(false);
  error = signal('');

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.orderService.getOrderHistory().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Unable to retrieve orders');
        this.loading.set(false);
      }
    });
  }
}
