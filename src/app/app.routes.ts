import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(c => c.AuthLayoutComponent),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent),
        data: { seo: { title: 'Login', description: 'Sign in to your EcoShop account' } },
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/signup/signup.component').then(c => c.SignupComponent),
        data: { seo: { title: 'Register', description: 'Create your EcoShop account and start shopping eco-friendly products' } },
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
    data: { seo: { title: 'Home', description: 'Discover eco-friendly products at great prices. Shop sustainably with EcoShop.' } },
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/product/products/products.component').then(c => c.ProductsComponent),
    data: { seo: { title: 'Products', description: 'Browse our full catalog of eco-friendly and sustainable products.' } },
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product/product-detail/product-detail.component').then(c => c.ProductDetailComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then(c => c.SearchComponent),
    data: { seo: { title: 'Search', description: 'Search for eco-friendly products on EcoShop.' } },
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/checkout/checkout.component').then(c => c.CheckoutComponent),
    data: { seo: { title: 'Checkout', description: 'Complete your order on EcoShop.' } },
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/order-history/order-history.component').then(c => c.OrderHistoryComponent),
    data: { seo: { title: 'Order History', description: 'View your past orders and track deliveries.' } },
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map.component').then(c => c.MapComponent),
    data: { seo: { title: 'Store Map', description: 'Find EcoShop locations near you.' } },
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(c => c.AboutComponent),
    data: { seo: { title: 'About Us', description: 'Learn about EcoShop and our mission for sustainable shopping.' } },
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/contact/contact.component').then(c => c.ContactComponent),
    data: { seo: { title: 'Contact', description: 'Get in touch with the EcoShop team.' } },
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(c => c.NotFoundComponent),
    data: { seo: { title: 'Page Not Found', description: 'The page you are looking for does not exist.' } },
  },
];
