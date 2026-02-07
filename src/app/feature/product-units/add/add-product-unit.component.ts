import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductUnitService } from '@core/services/product-unit.service';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '@shared/models/field/field-config.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { ProductUnit } from '@shared/models/product-unit/product-unit.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-product-unit',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent, RouterLink],
  templateUrl: './add-product-unit.component.html',
  styleUrl: './add-product-unit.component.scss',
})
export class AddProductUnitComponent extends PageConfiguration implements OnInit {
  public isEditMode = signal(false);
  public unitId: string | null = null;
  public initialData = signal<any>(null);

  public formConfig: FieldConfig[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
      colSpan: 1,
    },
    {
      name: 'conversionFactor',
      label: 'Conversor unidad',
      type: 'number',
      required: true,
      colSpan: 1,
    },
    {
      name: 'barcode',
      label: 'Barcode',
      type: 'text',
      required: false,
      colSpan: 1,
    },
  ];

  constructor(
    private productUnitService: ProductUnitService,
    private route: ActivatedRoute
  ) {
    super();
  }

  async ngOnInit() {
    this.unitId = this.route.snapshot.paramMap.get('id');
    if (this.unitId) {
      this.isEditMode.set(true);
      await this.loadUnit(this.unitId);
    }
  }

  async loadUnit(id: string) {
    try {
      const unit = await this.productUnitService.getById(id);
      this.initialData.set(unit);
    } catch (error) {
      this.provideError(error);
      this.nav.pop();
    }
  }

  async onSave(formData: any) {
    try {
      const payload: ProductUnit = {
        name: formData.name,
        conversionFactor: formData.conversionFactor,
        barcode: formData.barcode,
        ...formData // Override with form data
      };

      if (this.isEditMode() && this.unitId) {
        await this.productUnitService.update(this.unitId, payload);
        this.toast.show('Unidad actualizada correctamente', 'success');
      } else {
        await this.productUnitService.create(payload);
        this.toast.show('Unidad creada correctamente', 'success');
      }
      this.nav.push(this.ROUTES.nav.productUnits.list);
    } catch (error) {
      this.logger.error("Error al guardar la unidad", error);
      this.provideError(error);
    }
  }
}
