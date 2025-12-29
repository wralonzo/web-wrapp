import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { SelectOption } from '../../models/select/option.interface';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class CustomSelectComponent {
  // Inputs
  public options = input<SelectOption[]>([]);
  public label = input<string>();
  public selected = input<string | undefined>();

  // Output para notificar al padre
  public onSelectionChange = output<SelectOption>();

  private eRef = inject(ElementRef);
  public isOpen = signal(false);
  public selectedName = signal('');

  public selectedLabel = computed(() => {
    const currentOptions = this.options();
    const currentValue = this.selected();

    // Buscamos la opción que coincida con el valor seleccionado
    const found = currentOptions.find((opt) => opt.value === currentValue);

    // Si la encuentra devuelve el label, si no, un texto por defecto
    return found ? found.label : 'Seleccionar...';
  });

  toggle() {
    this.isOpen.update((v) => !v);
  }

  select(option: SelectOption) {
    this.selectedName.set(option.label);
    this.onSelectionChange.emit(option);
    this.isOpen.set(false);
  }

  // Función auxiliar para obtener iniciales si no existen
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
