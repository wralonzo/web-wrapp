import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservationService } from '@core/services/reservation.service';

@Component({
    selector: 'app-my-appointments',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './my-appointments.component.html',
    styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent implements OnInit {
    private reservationService = inject(ReservationService);
    public loading = signal(false);
    public appointments = signal<any[]>([]);

    ngOnInit(): void {
        this.loadAppointments();
    }

    private loadAppointments() {
        this.loading.set(true);
        this.reservationService.find().subscribe({
            next: (response) => {
                const data = (response as any).rows || response;
                this.appointments.set(Array.isArray(data) ? data : []);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error fetching appointments', err);
                this.loading.set(false);
            }
        });
    }

    cancelAppointment(id: string) {
        if (confirm('¿Seguro que deseas cancelar esta cita?')) {
            this.appointments.update(items => items.filter(a => a.id !== id));
        }
    }

    rescheduleAppointment(id: string) {
        alert('Reprogramación de cita ' + id + ' en desarrollo.');
    }
}
