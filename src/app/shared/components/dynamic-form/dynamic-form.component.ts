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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of, from } from 'rxjs';
import { FieldConfig, SelectOption } from '@shared/models/field/field-config.interface';
import { InputComponent } from '@shared/components/input/input.component';
import { CustomSelectComponent } from '@shared/components/select/select.component';
import { ButtonComponent } from '../button/button.component';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { catchError } from 'rxjs/operators';
@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    CustomSelectComponent,
    ButtonComponent,
    DatepickerComponent,
  ],
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent extends PageConfiguration implements OnInit {
  private readonly injector = inject(Injector);
  public data = input<any>();
  public fields = input.required<FieldConfig[]>();
  public onSubmit = output<any>();
  public onCancel = output<void>();
  public showSubmitButton = input(true);
  public isSubmitting = signal(false);
  public formSubmitted = signal(false);
  public form = new FormGroup<Record<string, FormControl>>({});
  public selectResources = new Map<string, ResourceRef<SelectOption<any>[] | undefined>>();

  constructor() {
    super();
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

        // 'from' convierte la Promesa de RustService en un Observable
        return from(
          this.rustService.call(async (bridge: GenericHttpBridge) => {
            const response = await bridge.get(request);

            this.logger.info(`Respuesta para ${field.name}:`, response);

            if (field.mapResponse) {
              return field.mapResponse(response);
            }
            return Array.isArray(response) ? response : [];
          })
        ).pipe(
          // Manejo de errores dentro del flujo de RxJS
          catchError((error) => {
            this.logger.error(`Error cargando select ${field.name}`, error);
            return of([]); // Devuelve array vacío en caso de fallo
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
