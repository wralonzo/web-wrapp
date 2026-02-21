import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'landing-page',
        pathMatch: 'full'
    },
    {
        path: 'landing-page',
        title: 'Top Fashion Salon',
        loadComponent: () => import('../reservations/landing-page/landing-page.component').then((m) => m.LandingPageComponent),
    },
    {
        path: 'auth-selection',
        title: 'Identifícate',
        loadComponent: () => import('../reservations/auth-selection/auth-selection.component').then((m) => m.AuthSelectionComponent),
    },
    {
        path: 'book',
        title: 'Reservar Cita',
        loadComponent: () => import('../reservations/appointment-booking/appointment-booking.component').then((m) => m.AppointmentBookingComponent),
    },
    {
        path: 'booking-confirmation',
        title: 'Reserva Confirmada',
        loadComponent: () => import('../reservations/booking-confirmation/booking-confirmation.component').then((m) => m.BookingConfirmationComponent),
    },
    {
        path: 'my-appointments',
        title: 'Mis Citas',
        loadComponent: () => import('../reservations/my-appointments/my-appointments.component').then((m) => m.MyAppointmentsComponent),
    },
    {
        path: 'profile',
        title: 'Mi Perfil',
        loadComponent: () => import('../reservations/client-profile/client-profile.component').then((m) => m.ClientProfileComponent),
    }
];
