import { Routes } from '@angular/router';
import { LoginComponent } from './feature/login/login.component';
import { authGuard } from './core/auth/auth.guard';
import { HomeComponent } from './feature/home/home';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { ClientsComponent } from './feature/clients/clients.component';
import { AddClientComponent } from './feature/clients/add-client/add-client.component';

export const routes: Routes = [
  {
    path: 'auth',
    title: 'Login',
    children: [{ path: 'login', component: LoginComponent }],
  },
  {
    path: 'app',
    component: LayoutComponent,
    title: 'APP',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'clients',
        component: ClientsComponent,
      },
      {
        path: 'clients/add',
        component: AddClientComponent,
      },
      { path: 'products', component: HomeComponent },
      { path: 'reservations', component: HomeComponent },
      { path: 'suppliers', component: HomeComponent },
      { path: 'users', component: HomeComponent },
      { path: 'productos', component: HomeComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  // Redirección por defecto
  { path: '**', redirectTo: 'auth/login' },
];
