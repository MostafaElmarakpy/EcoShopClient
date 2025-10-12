import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProductsComponent } from './pages/product/products/products.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
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
        // Public: No guard
      },
      {
        path: 'register',  // Or 'signup'
        loadComponent: () => import('./pages/signup/signup.component').then(c => c.SignupComponent),
        // Public: No guard (changed from canDeactivate)
      },
    ],
  },
   {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    // يمكنك إضافة canLoad: [AdminGuard] لاحقاً
    // canLoad: [AdminGuard] // يمكنك إضافة canLoad: [AdminGuard] لاحقاً
    // canActivate: [authGuard],  // Protected
    
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent),
    // canActivate: [authGuard],  // Protected
  },
  {
    path: 'products',  // List
    loadComponent: () => import('./pages/product/products/products.component').then(c => c.ProductsComponent),
    // canActivate: [authسشئيريبلا Guard],
  },

  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(c => c.AboutComponent),
    // Public
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/contact/contact.component').then(c => c.ContactComponent),
  },

   

  { path: '**', redirectTo: 'home' },
];
