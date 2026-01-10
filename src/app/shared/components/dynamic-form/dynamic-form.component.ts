import {
  Component,
  OnInit,
  inject,
  signal,
  input,
  output,
  ResourceRef,
  Injector,
  effect,
} from '@angular/core'; // 1. Importa Injector
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { FieldConfig, SelectOption } from '@shared/models/field/field-config.interface';
import { InputComponent } from '@shared/components/input/input.component';
import { CustomSelectComponent } from '@shared/components/select/select.component';
import { HttpService } from '@core/services/http.service';
import { ButtonComponent } from '../button/button.component';
import { DatepickerComponent } from '../datepicker/datepicker.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    CustomSelectComponent,
    ButtonComponent,
    DatepickerComponent
  ],
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnInit {
  private readonly http = inject(HttpService);
  private readonly injector = inject(Injector);
  data = input<any>();

  fields = input.required<FieldConfig[]>();
  onSubmit = output<any>();
  onCancel = output<void>();

  public isSubmitting = signal(false);
  public formSubmitted = signal(false);
  public form = new FormGroup<Record<string, FormControl>>({});

  // ResourceRef también usa los genéricos <T>
  public selectResources = new Map<string, ResourceRef<SelectOption<any>[] | undefined>>();

  constructor() {
    effect(() => {
      const values = this.data();
      if (values) {
        this.form.patchValue(values);
      }
    });
  }
  ngOnInit() {
    this.createForm();
  }

  createForm() {
    const group: Record<string, FormControl> = {};

    for (const field of this.fields()) {
      group[field.name] = new FormControl(
        field.valueDefault ?? '',
        field.required ? [Validators.required] : []
      );

      if (field.type === 'select' && field.endpoint) {
        // Ahora el Map guarda los recursos creados dinámicamente
        this.selectResources.set(field.name, this.initSelectResource(field));
      }
    }
    this.form = new FormGroup(group);
  }

  private initSelectResource(field: FieldConfig<any>) {
    const resourceOptions: any = {
      injector: this.injector,
      request: () => field.endpoint,
      stream: ({ request }: { request: string | undefined }) => {
        if (!request) return of([]);

        return this.http.doGet<any>(request).pipe(
          map((res) => {
            // Si el usuario definió un mapResponse, se usa su lógica tipada
            if (field.mapResponse) {
              return field.mapResponse(res);
            }
            return Array.isArray(res) ? res : [];
          })
        );
      },
    };
    return rxResource<SelectOption<any>[], string | undefined>(resourceOptions);
  }

  // Este método ahora devuelve el tipo correcto para el @for del HTML
  getOptions(field: FieldConfig<any>): SelectOption<any>[] {
    // 1. Si hay opciones estáticas, las devolvemos
    if (field.options) return field.options;

    // 2. Si no, buscamos en el mapa de recursos HTTP
    return this.selectResources.get(field.name)?.value() ?? [];
  }

  onSelectChange(fieldName: string, event: any) {
    const valueToSave =
      event && typeof event === 'object' && 'value' in event ? event.value : event;

    this.form.get(fieldName)?.setValue(valueToSave);
  }

  submit() {
    this.formSubmitted.set(true);
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
