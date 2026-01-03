import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  model, // <--- Cambiamos input por model
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectOption } from '../../models/select/option.interface';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class CustomSelectComponent {
  // Inputs y Modelos
  public options = input<SelectOption[]>([]);
  public label = input<string>();

  // Usamos model() para que el componente pueda actualizar el valor
  // y el padre reciba el cambio automáticamente con [(selected)]
  public selected = model<string | number | undefined>();

  public onSelectionChange = output<SelectOption>();

  private eRef = inject(ElementRef);
  public isOpen = signal(false);

  // Esta señal computada ahora reaccionará instantáneamente
  // cuando hagamos this.selected.set(...)
  public selectedLabel = computed(() => {
    const currentOptions = this.options();
    const currentValue = this.selected()?.toString();

    const found = currentOptions.find((opt) => opt.value === currentValue);
    return found ? found.label : 'Seleccionar...';
  });

  toggle() {
    this.isOpen.update((v) => !v);
  }

  select(option: SelectOption) {
    // 1. Actualizamos el modelo local (esto dispara el computed selectedLabel)
    this.selected.set(option.value);

    // 2. Notificamos al padre
    this.onSelectionChange.emit(option);

    // 3. Cerramos el menú
    this.isOpen.set(false);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .filter((word) => word.length > 0)
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
