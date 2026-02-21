import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

interface ServiceOption {
    id: string;
    name: string;
    icon: string;
    price: number;
}

interface StylistOption {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
}

@Component({
    selector: 'app-appointment-booking',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './appointment-booking.component.html',
    styleUrls: ['./appointment-booking.component.scss']
})
export class AppointmentBookingComponent implements OnInit {
    private fb = inject(FormBuilder);
    public authService = inject(AuthService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    bookingForm!: FormGroup;

    // Mock Data
    branches = [
        { id: 1, name: 'Centro Histórico - Calle Real 123' },
        { id: 2, name: 'Zona Norte - Plaza Mayor' }
    ];

    services: ServiceOption[] = [
        { id: 'cut', name: 'Corte', icon: 'icon-scissors', price: 45.00 },
        { id: 'dye', name: 'Tinte', icon: 'icon-palette', price: 85.00 },
        { id: 'mani', name: 'Manicura', icon: 'icon-hand', price: 30.00 },
        { id: 'facial', name: 'Facial', icon: 'icon-face', price: 60.00 }
    ];

    stylists: StylistOption[] = [
        { id: 's1', name: 'Sofia R.', role: 'Colorista Senior', avatarUrl: 'assets/images/stylists/sofia.jpg' },
        { id: 's2', name: 'Claudia L.', role: 'Estilista Pro', avatarUrl: 'assets/images/stylists/claudia.jpg' },
        { id: 'any', name: 'Cualquiera', role: 'Primer disponible', avatarUrl: 'assets/images/stylists/any.png' }
    ];

    // Calendario simplificado
    currentMonth = 'Octubre 2023';
    calendarDays: { date: number, inactive?: boolean, selected?: boolean }[] = [
        { date: 28, inactive: true }, { date: 29, inactive: true }, { date: 30, inactive: true },
        { date: 1 }, { date: 2 }, { date: 3 }, { date: 4 },
        { date: 5 }, { date: 6 }, { date: 7 }, { date: 8 }, { date: 9 }, { date: 10 }, { date: 11 },
        { date: 12, selected: true }, { date: 13 }, { date: 14 }, { date: 15 }, { date: 16 }, { date: 17 }, { date: 18 },
        { date: 19 }, { date: 20 }
    ];

    availableTimes = [
        '09:00 AM', '10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '03:45 PM', '05:00 PM', '06:30 PM'
    ];

    ngOnInit() {
        // If NOT authenticated, redirect back to landing or auth selection
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/client/auth-selection']);
            return;
        }

        this.bookingForm = this.fb.group({
            branchId: [this.branches[0].id, Validators.required],
            serviceId: ['dye', Validators.required],
            stylistId: ['s1', Validators.required],
            date: ['2023-10-12', Validators.required],
            time: ['11:30 AM', Validators.required]
        });

        const serviceId = this.route.snapshot.queryParamMap.get('serviceId');
        if (serviceId) {
            this.bookingForm.get('serviceId')?.setValue(serviceId);
        }
    }

    get selectedService() {
        return this.services.find(s => s.id === this.bookingForm.get('serviceId')?.value);
    }

    get selectedStylist() {
        return this.stylists.find(s => s.id === this.bookingForm.get('stylistId')?.value);
    }

    selectService(id: string) {
        this.bookingForm.get('serviceId')?.setValue(id);
    }

    selectStylist(id: string) {
        this.bookingForm.get('stylistId')?.setValue(id);
    }

    selectDay(day: number, inactive?: boolean) {
        if (inactive) return;
        this.calendarDays.forEach(d => d.selected = false);
        const selectedDay = this.calendarDays.find(d => d.date === day && !d.inactive);
        if (selectedDay) {
            selectedDay.selected = true;
            this.bookingForm.get('date')?.setValue(`2023-10-${day.toString().padStart(2, '0')}`);
        }
    }

    selectTime(time: string) {
        this.bookingForm.get('time')?.setValue(time);
    }


    async onSubmit() {
        if (this.bookingForm.valid) {
            console.log('Cita confirmada:', this.bookingForm.value);
            // Simulate API call and redirect to confirmation
            this.router.navigate(['/client/booking-confirmation']);
        }
    }
}
