import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';

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

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
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
        // If product ID is provided but cart is empty, navigate to the product detail page.
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
    this.cartService.clearCart();
    this.router.navigate(['/orders']);
  }
}
