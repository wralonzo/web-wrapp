import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './datepicker.component.html',
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      /* Ocultamos el icono nativo para que no choque con nuestro icono Zinc */
      /* Pero mantenemos el área cliqueable para abrir el calendario */
      input::-webkit-calendar-picker-indicator {
        background: transparent;
        bottom: 0;
        color: transparent;
        cursor: pointer;
        height: auto;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        width: auto;
      }
    `,
  ],
})
export class DatepickerComponent {
  /** Label descriptivo del campo (ej: 'Fecha de la Cita') */
  label = input<string | undefined>();

  /** El FormControl que viene desde el dynamic-form */
  control = input.required<FormControl>();

  /** Flag para disparar la validación visual al intentar guardar */
  showErrors = input<boolean>(false);

  /**
   * Getter opcional para verificar si el campo tiene errores
   * y ha sido tocado o el formulario fue enviado.
   */
  get hasError(): boolean {
    return (
      this.showErrors() &&
      this.control().invalid &&
      (this.control().dirty || this.control().touched || this.showErrors())
    );
  }
}
