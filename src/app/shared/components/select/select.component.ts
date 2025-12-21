import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
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

  // Output para notificar al padre
  public onSelectionChange = output<SelectOption>();

  private eRef = inject(ElementRef);
  public isOpen = signal(false);
  public selectedName = signal('');

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
