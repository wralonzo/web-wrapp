import { Routes } from '@angular/router';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { UserRole } from '@shared/enums/roles/roles.enum';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    data: { rols: [UserRole.ADMIN, UserRole.SALES, UserRole.WAREHOUSE] },
    title: 'Lista de Productos',
    loadComponent: () => import('./list/list-product.component').then((m) => m.ListProductComponent),
  },
  {
    path: APP_ROUTES.definitions.add,
    data: { rols: [UserRole.ADMIN, UserRole.SALES, UserRole.WAREHOUSE] },
    loadComponent: () => import('./add/add-product.component').then((m) => m.AddProductComponent),
  },
  {
    path: APP_ROUTES.definitions.view,
    data: { rols: [UserRole.ADMIN, UserRole.SALES, UserRole.WAREHOUSE] },
    loadComponent: () => import('./view/view-product.component').then((m) => m.ViewProductComponent),
  },
  {
    path: APP_ROUTES.definitions.edit,
    data: { rols: [UserRole.ADMIN, UserRole.SALES, UserRole.WAREHOUSE] },
    loadComponent: () => import('./edit/edit-product.component').then((m) => m.EditProductComponent),
  },
];
