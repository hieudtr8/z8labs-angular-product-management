import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductFormComponent } from './components/product/product-form/product-form.component';
import { CategoryListComponent } from "./components/category/category-list/category-list.component";
import { CategoryFormComponent } from "./components/category/category-form/category-form.component";
import { LoginComponent } from "./components/login/login.component";
import { authGuard } from "./guard/auth.guard";
import { loggedInGuard } from "./guard/logged-in.guard";
import { DefaultLayoutComponent } from "./layout";

export const routes: Routes = [
  // Login route
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loggedInGuard] },

  // Protected routes under a single parent
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'products/new', component: ProductFormComponent },
      { path: 'products/edit/:id', component: ProductFormComponent },
      { path: 'categories', component: CategoryListComponent },
      { path: 'categories/new', component: CategoryFormComponent },
      { path: 'categories/edit/:id', component: CategoryFormComponent },
    ]
  },

  // Wildcard route for any unmatched routes
  { path: '**', redirectTo: 'dashboard' }
];
