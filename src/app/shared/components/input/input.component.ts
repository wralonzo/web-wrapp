import {
  Component,
  input,
  output,
  OnInit,
  OnDestroy,
  signal,
  Self,
  Optional,
  computed,
} from '@angular/core';
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
  public label = input<string>('');
  public name = input<string>('');
  public type = input<'text' | 'password' | 'email' | 'tel' | 'number' | 'date'>('text');
  public placeholder = input<string>('');
  public debounceMs = input<number>(0);
  public value: string = '';
  public required = input<boolean>(false);
  public minLength = input<number | null>(null);
  public maxLength = input<number | null>(null);
  public showErrors = input<boolean>(false);
  showPassword = signal(false);

  // Eventos estándar para quien prefiera no usar Forms
  public onValueChange = output<string>();
  public onBlur = output<void>();

  // Estado interno
  public internalValue = signal<string>('');
  public isDisabled = signal<boolean>(false);
  public isTouched = signal(false);

  // Manejo de Debounce y Ciclo de vida
  private inputSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Callbacks de Angular Forms
  onChange: any = () => {};
  onTouch: any = () => {};

  public canShowErrors = computed(() => this.isTouched() || this.showErrors());
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
    this.isTouched.set(true);
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

  public isInvalidEmail = computed(() => {
    if (this.type() !== 'email' || !this.internalValue()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(this.internalValue());
  });

  public isFutureDate = computed(() => {
    if (this.type() !== 'date' || !this.internalValue()) return false;
    const selectedDate = new Date(this.internalValue());
    const today = new Date();
    return selectedDate > today;
  });

  inputType = computed(() => {
    if (this.type() === 'password') {
      return this.showPassword() ? 'text' : 'password';
    }
    return this.type();
  });

  togglePassword() {
    this.showPassword.update((v) => !v);
  }
}
