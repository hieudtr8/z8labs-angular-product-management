import { Routes } from '@angular/router';
import { authGuard } from "./guard/auth.guard";
import { loggedInGuard } from "./guard/logged-in.guard";
import { LoginComponent } from "./pages/login/login.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { ProductListComponent } from "./pages/product/product-list/product-list.component";
import { ProductFormComponent } from "./pages/product/product-form/product-form.component";
import { CategoryListComponent } from "./pages/category/category-list/category-list.component";
import { CategoryFormComponent } from "./pages/category/category-form/category-form.component";
import { RegisterComponent } from "./pages/register/register.component";
import { AdminLayoutComponent } from "./layout/admin-layout/admin-layout.component";
import { UserLayoutComponent } from "./layout/user-layout/user-layout.component";
import { authAdminGuard } from "./guard/auth-admin.guard";
import { PurchaseProductComponent } from "./pages/purchase-product/purchase-product.component";
import { PurchaseHistoryComponent } from "./pages/purchase-history/purchase-history.component";

export const routes: Routes = [
  // Login route
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login',
    component: LoginComponent,
    canActivate: [
      loggedInGuard
    ]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [
      loggedInGuard
    ]
  },

  // Protected user routes
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [
      authGuard
    ],
    children: [
      { path: 'purchase-product', component: PurchaseProductComponent },
      { path: 'purchase-history', component: PurchaseHistoryComponent }
    ]
  },

  // Protected admin routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [
      authAdminGuard
    ],
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
