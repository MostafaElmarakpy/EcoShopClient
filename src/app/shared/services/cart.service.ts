import { Injectable, computed, signal } from '@angular/core';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imagePath?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSignal = signal<CartItem[]>(this.loadCart());
  cartItems = computed(() => this.cartItemsSignal());

  get totalAmount() {
    return this.cartItemsSignal().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  addToCart(item: CartItem): void {
    const items = [...this.cartItemsSignal()];
    const existing = items.find(x => x.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push({ ...item });
    }
    this.cartItemsSignal.set(items);
    this.saveCart(items);
  }

  removeItem(productId: number): void {
    const items = this.cartItemsSignal().filter(item => item.productId !== productId);
    this.cartItemsSignal.set(items);
    this.saveCart(items);
  }

  clearCart(): void {
    this.cartItemsSignal.set([]);
    this.saveCart([]);
  }

  private loadCart(): CartItem[] {
    try {
      const value = localStorage.getItem('eco-shop-cart');
      return value ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('eco-shop-cart', JSON.stringify(items));
  }
}
