import { Routes } from '@angular/router';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { UserRole } from '@shared/enums/roles/roles.enum';

export const RESERVATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/list-reservation.component').then((m) => m.ListReservationComponent),
    title: 'Lista de Reservaciones',
  },
  {
    path: APP_ROUTES.definitions.add,
    title: 'Nueva Reservación',
    loadComponent: () => import('./add/add-reservation.component').then((m) => m.AddReservationComponent),
  },
  {
    path: APP_ROUTES.definitions.edit,
    title: 'Editar Reservación',
    loadComponent: () => import('./edit/edit-reservation.component').then((m) => m.EditReservationComponent),
  },
  {
    path: APP_ROUTES.definitions.view,
    title: 'Ver Reservación',
    data: { rols: [UserRole.ADMIN, UserRole.SALES, UserRole.CLIENT] },
    loadComponent: () => import('./view/view-reservation.component').then((m) => m.ViewReservationComponent),
  },
  {
    path: 'book',
    title: 'Reservar Cita',
    loadComponent: () => import('./appointment-booking/appointment-booking.component').then((m) => m.AppointmentBookingComponent),
  },
];
