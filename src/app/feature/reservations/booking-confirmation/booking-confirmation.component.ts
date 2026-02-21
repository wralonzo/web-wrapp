import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-booking-confirmation',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './booking-confirmation.component.html',
    styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent {
    public appointmentDetails = {
        service: 'Tinte + Hidratación',
        stylist: 'Sofia R.',
        date: '12 de Octubre 2023',
        time: '11:30 AM',
        branch: 'Centro Histórico - Calle Real 123'
    };

    addToGoogleCalendar() {
        // Placeholder function for Google Calendar integration
        console.log('Agregando a Google Calendar...');
        const text = encodeURIComponent(`Cita en Top Fashion: ${this.appointmentDetails.service}`);
        const details = encodeURIComponent(`Cita con ${this.appointmentDetails.stylist} en la sucursal ${this.appointmentDetails.branch}`);
        const location = encodeURIComponent(this.appointmentDetails.branch);
        // Dummy dates for the link
        const dates = '20231012T173000Z/20231012T183000Z';
        const url = `https://calendar.google.com/calendar/r/eventedit?text=${text}&details=${details}&location=${location}&dates=${dates}`;
        window.open(url, '_blank');
    }
}
