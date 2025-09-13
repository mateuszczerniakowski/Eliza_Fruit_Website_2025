import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'products', 
    loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent)
  },
  { 
    path: 'services', 
    loadComponent: () => import('./features/services/services.component').then(m => m.ServicesComponent)
  },
  { 
    path: 'about', 
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
  },
  { path: '**', redirectTo: '/home' }
];
