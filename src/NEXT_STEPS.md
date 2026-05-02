# Next Steps

## DONE

### SEO
- [x] Dynamic page titles per route
- [x] Meta descriptions per route
- [x] OpenGraph + Twitter card tags
- [x] Dynamic SEO for product detail (name, price, image)

### Error Handling
- [x] Global ErrorHandler with toast notifications
- [x] NotificationService (success, error, warning, info)
- [x] HTTP error interceptor with user-friendly messages
- [x] Token refresh with proper logout on failure

### Auth Guards
- [x] Applied authGuard to /checkout and /orders
- [x] Wildcard (**) route for 404 page

### Backend Alignment
- [x] ProductService supports page, pageSize, search, sort, category, minPrice, maxPrice
- [x] PaginatedResponse model for paginated API responses
- [x] Backward compatible (handles both array and paginated wrapper)

### Performance
- [x] Lazy loading images (`loading="lazy"`)

### App Configuration
- [x] provideHttpClient with interceptor support
- [x] provideAnimations
- [x] GlobalErrorHandler provider

---

## 1. SSR (Angular SSR)
Run:
```
ng add @angular/ssr
```

---

## 2. Search Enhancement
- Add autocomplete API endpoint
- Add dropdown suggestions component
- Debounce already done frontend

---

## 3. Improve Checkout
- Add step-by-step form validation (shipping -> payment -> confirm)
- Connect to OrderService.createOrder() on submit
- Add real payment integration (Stripe/PayPal)

---

## 4. Testing
- Add unit tests for services (ProductService, AuthService, CartService, NotificationService)
- Add unit tests for guards (authGuard)
- Add E2E tests (Cypress or Playwright)

---

## 5. Performance
- Reduce bundle size (tree-shake bootstrap, review primeng imports)
- Optimize images (WebP, srcset)
- Consider virtual scrolling for large product lists

---

## 6. Additional Features
- Role-based auth guard (admin vs user)
- Cart improvements (quantity +/- buttons, remove confirmation)
- Wishlist feature
- Product reviews/ratings
