import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '@shared/models/field/field-config.interface';
import { Product } from '@shared/models/product/produt-response.interface';
import { PageConfiguration } from 'src/app/page-configurations';

@Component({
  selector: 'app-add',
  imports: [CommonModule, DynamicFormComponent, RouterLink],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
  providers: [ProductService],
})
export class AddProductComponent extends PageConfiguration {
  public productFormConfig: FieldConfig[] = [
    {
      name: 'name',
      label: 'Nombre del Producto',
      type: 'text',
      required: true,
      colSpan: 1, // Ocupa toda la fila
    },
    {
      name: 'sku',
      label: 'SKU / Código',
      type: 'text',
      required: true,
      colSpan: 1,
    },
    {
      name: 'priceSale',
      label: 'Precio de Venta',
      type: 'number',
      required: true,
      colSpan: 1,
      valueDefault: 0,
    },
    {
      name: 'stockMinim',
      label: 'Stock Mínimo',
      type: 'number',
      required: false,
      colSpan: 1,
      valueDefault: 0,
    },
    {
      name: 'barcode',
      label: 'Código de barras',
      type: 'text',
      required: false,
      colSpan: 1,
      valueDefault: 0,
    },
    {
      name: 'pricePurchase',
      label: 'Precio de compra',
      type: 'number',
      required: true,
      colSpan: 1,
      valueDefault: 0,
    },
    {
      name: 'categoryId',
      label: 'Categoría',
      type: 'select',
      required: true,
      colSpan: 1,
      endpoint: 'category', // Tu ruta de Spring Boot
      // Transformamos lo que viene del back al formato {label, value}
      mapResponse: (res: any) =>
        res.data.content.map((cat: any) => ({
          label: cat.name,
          value: cat.id,
        })),
    },
    {
      name: 'description',
      label: 'Descripción del producto',
      type: 'textarea',
      colSpan: 1,
    },
  ];

  // En tu componente .ts
  async onSaveProduct(formData: any) {
    console.log('Objeto listo para el backend:', formData);
    const payload: Product = {
      name: formData.name,
      description: formData.description,
      sku: formData.sku,
      barcode: formData.barcode,
      pricePurchase: formData.pricePurchase,
      priceSale: formData.priceSale,
      stockMinim: formData.stockMinim,
      active: true,
      categoryId: formData.categoryId.value,
    };
    await this.rustSerive.call(async (bridge) => {
      return await bridge.post('/products', payload);
    });
  }
}
