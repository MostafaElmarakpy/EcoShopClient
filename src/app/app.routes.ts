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
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (c) => c.AuthLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/signup/signup.component').then(
            (c) => c.SignupComponent
          ),
        canDeactivate: [authGuard],
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.component').then((c) => c.LoginComponent),
      },
    ],
    },
    {
    path: 'home',
    loadComponent: () =>
        import('./pages/home/home.component').then((c) => c.HomeComponent),
    },
    {
    path: 'products',
    loadComponent: () =>
        import('./pages/product/products/products.component').then(
        (c) => c.ProductsComponent
        ),
    },


    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
     { path: 'product/:id', component: ProductsComponent },
   


    { path: '**', redirectTo: 'home' },
];
