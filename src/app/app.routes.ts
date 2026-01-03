import { Routes } from '@angular/router';
import { LoginComponent } from './feature/login/login.component';
import { authGuard } from './core/auth/auth.guard';
import { HomeComponent } from './feature/home/home';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { ClientsComponent } from './feature/clients/clients.component';
import { AddClientComponent } from './feature/clients/add-client/add-client.component';
import { EditClientComponent } from './feature/clients/edit-client/edit-client.component';
import { ClientDetailComponent } from './feature/clients/client-detail/client-detail.component';
import { ListUserComponent } from './feature/user/list/list.component';
import { AddUserComponent } from './feature/user/add/add.component';
import { EditUserComponponent } from './feature/user/edit/edit.component';
import { ViewUserComponent } from './feature/user/view/view.component';

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
        children: [
          { path: '', component: ClientsComponent },
          {
            path: 'add',
            component: AddClientComponent,
          },
          { path: 'edit/:id', component: EditClientComponent },
          { path: 'view/:id', component: ClientDetailComponent },
        ],
      },
      {
        path: 'users',
        children: [
          { path: '', component: ListUserComponent },
          {
            path: 'add',
            component: AddUserComponent,
          },
          { path: 'edit/:id', component: EditUserComponponent },
          { path: 'view/:id', component: ViewUserComponent },
          { path: 'reset-pasword/:id', component: ListUserComponent },
        ],
      },
      { path: 'products', component: HomeComponent },
      { path: 'reservations', component: HomeComponent },
      { path: 'suppliers', component: HomeComponent },
      { path: 'productos', component: HomeComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'auth/login' },
];
