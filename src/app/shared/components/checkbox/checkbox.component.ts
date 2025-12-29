import { Component, input, Self, Optional } from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent implements ControlValueAccessor {
  label = input<string>('');
  id = input<string>(`checkbox-${Math.random().toString(36).substring(2, 9)}`);

  checked: boolean = false;
  isDisabled: boolean = false;

  // Inyectamos NgControl para validaciones automáticas
  constructor(@Self() @Optional() public controlDir: NgControl) {
    if (this.controlDir) {
      this.controlDir.valueAccessor = this;
    }
  }

  get isInvalid(): boolean {
    return !!(this.controlDir && this.controlDir.invalid && this.controlDir.touched);
  }

  // Métodos CVA
  onChange = (val: boolean) => {};
  onTouched = () => {};

  toggle() {
    if (!this.isDisabled) {
      this.checked = !this.checked;
      this.onChange(this.checked);
      this.onTouched();
    }
  }

  writeValue(val: boolean): void {
    this.checked = !!val;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
