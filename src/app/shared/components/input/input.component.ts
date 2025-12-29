import { Component, input, output, OnInit, OnDestroy, signal, Self, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, ReactiveFormsModule, NgControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [],
  templateUrl: './input.component.html',
})
export class InputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  // Inputs de configuración
  label = input<string>('');
  name = input<string>('');
  type = input<'text' | 'password' | 'email' | 'tel' | 'number' | 'date'>('text');
  placeholder = input<string>('');
  debounceMs = input<number>(0);
  value: string = '';
  required = input<boolean>(false);

  // Eventos estándar para quien prefiera no usar Forms
  onValueChange = output<string>();
  onBlur = output<void>();

  // Estado interno
  internalValue = signal<string>('');
  isDisabled = signal<boolean>(false);

  // Manejo de Debounce y Ciclo de vida
  private inputSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Callbacks de Angular Forms
  onChange: any = () => {};
  onTouch: any = () => {};
  // Inyectamos el control de Angular
  constructor(@Self() @Optional() public controlDir: NgControl) {
    if (this.controlDir) {
      this.controlDir.valueAccessor = this;
    }
  }

  ngOnInit() {
    // Configuramos el Debounce
    this.inputSubject
      .pipe(debounceTime(this.debounceMs()), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val) => {
        this.onValueChange.emit(val);
        this.onChange(val); // Notifica a ngModel/ReactiveForms
      });
  }

  // Helper para saber si mostrar error
  get isInvalid(): boolean {
    return !!(this.controlDir && this.controlDir.invalid && this.controlDir.touched);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTouched = () => {};

  // Métodos disparados por el HTML
  handleInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.internalValue.set(val);
    this.inputSubject.next(val);
  }

  handleBlur() {
    this.onTouch();
    this.onBlur.emit();
  }

  // --- Implementación de ControlValueAccessor ---
  writeValue(value: any): void {
    this.internalValue.set(value || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
