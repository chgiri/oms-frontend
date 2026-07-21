import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/app-shell/app-shell.component').then((m) => m.AppShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/products-list/products-list.component').then(
            (m) => m.ProductsListComponent,
          ),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./features/products/product-form/product-form.component').then(
            (m) => m.ProductFormComponent,
          ),
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./features/products/product-form/product-form.component').then(
            (m) => m.ProductFormComponent,
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customers/customer-list/customer-list.component').then(
            (m) => m.CustomersListComponent,
          ),
      },
      {
        path: 'customers/new',
        loadComponent: () =>
          import('./features/customers/customer-form/customer-form.component').then(
            (m) => m.CustomerFormComponent,
          ),
      },
      {
        path: 'customers/:id/edit',
        loadComponent: () =>
          import('./features/customers/customer-form/customer-form.component').then(
            (m) => m.CustomerFormComponent,
          ),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./features/inventory/inventory-list/inventory-list.component').then(
            (m) => m.InventoryListComponent,
          ),
      },
      {
        path: 'inventory/new',
        loadComponent: () =>
          import('./features/inventory/inventory-form/inventory-form.component').then(
            (m) => m.InventoryFormComponent,
          ),
      },
      {
        path: 'inventory/:id/edit',
        loadComponent: () =>
          import('./features/inventory/inventory-form/inventory-form.component').then(
            (m) => m.InventoryFormComponent,
          ),
      },

      // Orders, Payments, Shipments
      // get added here as child routes in the phases ahead.
    ],
  },
];
