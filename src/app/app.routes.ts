import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(c => c.AuthLayoutComponent),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/signup/signup.component').then(c => c.SignupComponent),
      },
    ],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/product/products/products.component').then(c => c.ProductsComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product/product-detail/product-detail.component').then(c => c.ProductDetailComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then(c => c.SearchComponent),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(c => c.CheckoutComponent),
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/order-history/order-history.component').then(c => c.OrderHistoryComponent),
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map.component').then(c => c.MapComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(c => c.AboutComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/contact/contact.component').then(c => c.ContactComponent),
  },
];
