import { Component, computed, input, output } from '@angular/core'; // 👈 Importamos output
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  label = input.required<string>();
  type = input<'button' | 'submit'>('button');
  isLoading = input<boolean>(false);
  isDisabled = input<boolean>(false);
  icon = input<string | null>(null);
  btnType = input<string | null>('primary');
  classCustom = input<string | null>();

  iconUrl = computed(() => {
    const iconName = this.icon();
    if (!iconName) return '';
    return `/assets/icons/${iconName}.svg`;
  });
  // Definimos el evento de salida
  btnClick = output<void>(); // 👈 Esto reemplaza al antiguo @Output

  handleClick(event: Event) {
    // Si es un submit, dejamos que el formulario lo maneje
    // Si es un botón normal, emitimos el evento solo si no está cargando o deshabilitado
    if (this.type() === 'button' && !this.isLoading() && !this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      this.btnClick.emit(); // 👈 Ejecutamos la acción en el padre
    }
  }
}
