import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '@core/services/confirm.service';

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-modal.component.html',
  styleUrl: './custom-modal.component.scss',
})
export class CustomModalComponent {
  // Inputs: Configuración de textos
  title = input<string>('Confirmar acción');
  message = input<string>('¿Estás seguro de realizar esta operación?');
  btnConfirmText = input<string>('Confirmar');
  btnCancelText = input<string>('Cancelar');
  variant = input<'danger' | 'primary' | 'info'>('primary');

  // Outputs: Los "callbacks"
  onConfirm = output<void>();
  onCancel = output<void>();

  public confirmService = inject(ConfirmService);
}
