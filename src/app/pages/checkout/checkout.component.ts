import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { OrderService, CreateOrderRequest } from '../../shared/services/order.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  step = signal(1);
  checkoutForm: FormGroup;
  items = computed(() => this.cartService.cartItems());
  orderTotal = computed(() => this.cartService.totalAmount);
  submitting = signal(false);
  orderError = signal('');

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private orderService: OrderService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      paymentMethod: ['card', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const productId = Number(params.get('productId'));
      if (productId && this.cartService.cartItems().length === 0) {
        this.router.navigate(['/product', productId]);
      }
    });
  }

  nextStep(): void {
    if (this.step() < 3) {
      this.step.update(current => current + 1);
    }
  }

  previousStep(): void {
    if (this.step() > 1) {
      this.step.update(current => current - 1);
    }
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.orderError.set('');

    const formValue = this.checkoutForm.value;
    const order: CreateOrderRequest = {
      items: this.items().map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
      })),
      shippingAddress: {
        fullName: formValue.fullName,
        address: formValue.address,
        city: formValue.city,
        postalCode: formValue.postalCode,
      },
      paymentMethod: formValue.paymentMethod,
    };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.submitting.set(false);
        this.notificationService.success('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.orderError.set(err?.message ?? 'Failed to place order. Please try again.');
      }
    });
  }
}
