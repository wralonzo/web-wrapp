import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectOption } from '../../models/select/option.interface';

@Component({
  selector: 'app-multi-select-roles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multi-select-roles.component.html',
})
export class MultiSelectRolesComponent {
  // Inputs
  public options = input<SelectOption[]>([]); // Ej: [{value: 'ROLE_ADMIN', label: 'Administrador'}, ...]
  public label = input<string>('Asignar Roles');

  // Modelo bidireccional para el array de strings
  public selectedRoles = model<string[]>([]);

  private eRef = inject(ElementRef);
  public isOpen = signal(false);

  // Label dinámico: Muestra los nombres de los roles seleccionados separados por coma
  public displayLabel = computed(() => {
    const selected = this.selectedRoles();
    const allOptions = this.options();

    if (selected.length === 0) return 'Sin roles asignados';

    const names = allOptions
      .filter((opt) => selected.includes(opt.value.toString()))
      .map((opt) => opt.label);

    return names.join(', ');
  });

  toggle() {
    this.isOpen.update((v) => !v);
  }

  // Lógica de selección múltiple
  toggleRole(roleValue: string) {
    const current = [...this.selectedRoles()];
    const index = current.indexOf(roleValue);

    if (index > -1) {
      current.splice(index, 1); // Si existe, lo quitamos
    } else {
      current.push(roleValue); // Si no existe, lo agregamos
    }

    this.selectedRoles.set(current);
  }

  // Verifica si un rol está seleccionado para marcar el checkbox en la UI
  isSelected(value: string): boolean {
    return this.selectedRoles().includes(value);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
