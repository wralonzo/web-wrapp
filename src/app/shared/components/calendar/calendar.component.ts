import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addDays, subDays, format, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  CalendarEvent,
  CalendarView,
  CalendarWeekViewComponent, // <--- Cambiamos a Vista Semanal
  CalendarUtils,
} from 'angular-calendar';

@Component({
  selector: 'app-reservation-calendar',
  standalone: true,
  imports: [CommonModule, CalendarWeekViewComponent],
  providers: [CalendarUtils],
  templateUrl: './calendar.component.html',
})
export class ReservationCalendarComponent {
  viewDate = signal<Date>(new Date());

  // Título que muestra el rango de la semana (ej: "5 - 11 de enero")
  calendarTitle = computed(() => {
    const start = startOfWeek(this.viewDate(), { weekStartsOn: 1 });
    const end = endOfWeek(this.viewDate(), { weekStartsOn: 1 });

    if (start.getMonth() === end.getMonth()) {
      return `${format(start, 'd')} - ${format(end, 'd')} de ${format(start, 'MMMM', {
        locale: es,
      })}`;
    }
    return `${format(start, 'd MMMM', { locale: es })} - ${format(end, 'd MMMM', { locale: es })}`;
  });

  // Navegación por bloques de 7 días
  next() {
    this.viewDate.update((date) => addDays(date, 7));
  }

  prev() {
    this.viewDate.update((date) => subDays(date, 7));
  }

  setToday() {
    this.viewDate.set(new Date());
  }

  events = signal<CalendarEvent[]>([
    {
      start: new Date(),
      title: 'Cita de Belleza',
      color: { primary: '#18181b', secondary: '#f4f4f5' },
    },
     {
      start: new Date(),
      title: 'Cita de Belleza',
      color: { primary: '#18181b', secondary: '#1010e7' },
    },
  ]);
}
