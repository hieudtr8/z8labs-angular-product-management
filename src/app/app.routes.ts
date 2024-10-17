import { Routes } from '@angular/router';
import { authGuard } from "./guard/auth.guard";
import { loggedInGuard } from "./guard/logged-in.guard";
import { DefaultLayoutComponent } from "./layout";
import { LoginComponent } from "./pages/login/login.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { ProductListComponent } from "./pages/product/product-list/product-list.component";
import { ProductFormComponent } from "./pages/product/product-form/product-form.component";
import { CategoryListComponent } from "./pages/category/category-list/category-list.component";
import { CategoryFormComponent } from "./pages/category/category-form/category-form.component";

export const routes: Routes = [
  // Login route
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',
    component: LoginComponent,
    canActivate: [loggedInGuard]
  },

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
