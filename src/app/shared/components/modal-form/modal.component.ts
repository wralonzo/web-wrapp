import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  // Control de visibilidad bidireccional
  isOpen = model<boolean>(false);

  // Inputs de configuración
  title = input<string>('Confirmar acción');
  confirmLabel = input<string>('Guardar');
  cancelLabel = input<string>('Cancelar');
  isSubmitting = input<boolean>(false);
  isValid = input<boolean>(true); // Para deshabilitar el botón si el formulario es inválido

  // Eventos
  onConfirm = output<void>();
  onCancel = output<void>();

  close() {
    if (this.isSubmitting()) return;
    this.isOpen.set(false);
    this.onCancel.emit();
  }

  confirm() {
    if (this.isValid() && !this.isSubmitting()) {
      this.onConfirm.emit();
    }
  }
}
