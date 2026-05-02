# Architecture Overview

## Structure

```
src/app/
  guards/           -> authGuard (functional, canActivate)
  interceptors/     -> TokenInterceptor (class-based, DI)
  shared/
    services/       -> Auth, Product, Cart, Order, Theme, SEO, Notification, GlobalErrorHandler
    components/     -> NotificationToast
    Directives/
    Pipes/
  pages/
    home/           -> Featured products, new arrivals
    product/        -> Products list, product detail
    search/         -> Search results
    checkout/       -> Multi-step checkout
    order-history/  -> Past orders
    map/            -> Geolocation
    login/          -> Login form
    signup/         -> Registration form
  components/       -> Header, Footer, About, Contact, NotFound, ConfirmModal
  layouts/          -> AuthLayout, UserLayout
  models/           -> IProduct, IUser, ILogin, IRegister
  admin/            -> Admin module (lazy-loaded)
```

## Key Decisions

- Standalone components (no NgModules for new components)
- Lazy loading routes
- Signals for state management (CartService, ThemeService, ProductsComponent)
- Feature-based architecture
- Route-level SEO data with centralized SeoService
- Global error handling via ErrorHandler + NotificationService
- Auth guard on protected routes (checkout, orders)

## Data Flow

```
Component -> Service -> HTTP API
                    \-> Interceptor (auth token, error handling)
                    \-> NotificationService (user feedback)
```

## Providers (app.config.ts)

- `provideRouter(routes)` - lazy-loaded routing
- `provideHttpClient(withInterceptorsFromDi())` - HTTP with class-based interceptors
- `provideAnimations()` - Angular animations
- `TokenInterceptor` - auth token injection + refresh + error notifications
- `GlobalErrorHandler` - uncaught error -> toast notification

## Future Direction

- Add `@angular/ssr` for server-side rendering
- Add NgRx or Signal Store for complex state
- Improve caching (HTTP cache, service-level memoization)
- Add role-based guards
- Add unit + E2E tests
