import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '@shared/models/field/field-config.interface';
import { PageConfiguration } from 'src/app/page-configurations';

@Component({
  selector: 'app-add',
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './add-reservation.component.html',
  styleUrl: './add-reservation.component.scss',
})
export class AddReservationComponent extends PageConfiguration {
  // Definición de campos basada en tu interfaz Reservation
  public fields = signal<FieldConfig<any>[]>([
    {
      name: 'clientName',
      label: 'Nombre de la Cliente',
      type: 'text', // Ahora TS sabe que esto es el literal 'text' y no un string cualquiera
      required: true,
      colSpan: 2,
    },
    {
      name: 'warehouseName',
      label: 'Sucursal / Local',
      type: 'select',
      required: true,
      colSpan: 1,
      options: [
        { label: 'Sede Central', value: 'Sede Central' },
        { label: 'Zona Rosa', value: 'Zona Rosa' },
      ],
    },
    {
      name: 'service',
      label: 'Servicio deseado',
      type: 'select',
      required: true,
      colSpan: 1,
      options: [
        { label: 'Corte y Peinado', value: 'Corte' },
        { label: 'Manicura Spa', value: 'Manicura' },
        { label: 'Tinte Completo', value: 'Tinte' },
        { label: 'Tratamiento Hidratante', value: 'Tratamiento' },
      ],
    },
    {
      name: 'employeeName',
      label: 'Profesional (Estilista)',
      type: 'select',
      required: true,
      colSpan: 1,
      options: [
        { label: 'Cualquiera disponible', value: 'any' },
        { label: 'Ana Martínez', value: 'Ana' },
        { label: 'Sofía López', value: 'Sofia' },
      ],
    },
    {
      name: 'type',
      label: 'Tipo de Cita',
      type: 'select',
      required: true,
      colSpan: 1,
      options: [
        { label: 'Cita Normal', value: 'Normal' },
        { label: 'Evento / Boda', value: 'Evento' },
        { label: 'Urgencia', value: 'Urgencia' },
      ],
    },
    {
      name: 'reservationDate',
      label: 'Fecha de la Cita',
      type: 'date',
      required: true,
      colSpan: 1,
    },
    {
      name: 'time',
      label: 'Hora disponible',
      type: 'select',
      required: true,
      colSpan: 1,
      options: [
        { label: '09:00 AM', value: '09:00' },
        { label: '10:30 AM', value: '10:30' },
        { label: '02:00 PM', value: '14:00' },
      ],
    },
    {
      name: 'notes',
      label: 'Notas o preferencias especiales',
      type: 'text', // O 'textarea' si tu input lo soporta
      colSpan: 2,
      required: false,
    },
  ]);

  handleSave(formData: any) {
    console.log('Nueva Reservación:', formData);
    // Aquí iría tu servicio para guardar
  }
}
