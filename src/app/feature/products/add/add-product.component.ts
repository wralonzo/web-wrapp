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
      name: 'stockMinim',
      label: 'Stock Mínimo',
      type: 'number',
      required: false,
      colSpan: 1,
      valueDefault: 1,
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
      name: 'priceSale',
      label: 'Precio de Venta',
      type: 'number',
      required: true,
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
      name: 'description',
      label: 'Descripción del producto',
      type: 'textarea',
      colSpan: 1,
    },
    {
      name: 'categoryId',
      label: 'Categoría',
      type: 'select',
      required: true,
      colSpan: 1,
      endpoint: '/category',
      mapResponse: (r: any) => (r.content || r).map((c: any) => ({ label: c.name, value: c.id }))
    },
    {
      name: 'unitId', // Virtual field for selection
      label: 'Unidad de Medida (Base)',
      type: 'select',
      required: false,
      colSpan: 1,
      endpoint: '/inventory/product-units',
      mapResponse: (r: any) => (r.content || r).map((u: any) => ({ label: u.name, value: u.id }))
    },
    {
      name: 'type',
      label: 'Tipo de Producto',
      type: 'select',
      required: true,
      valueDefault: 'STANDAR',
      colSpan: 1,
      options: [
        { label: 'Producto', value: 'STANDAR' },
        { label: 'Servicio', value: 'SERVICE' },
        { label: 'Combo', value: 'BUNDLE' }
      ]
    }
  ];

  // En tu componente .ts
  async onSaveProduct(formData: any) {
    try {
      const payload: Product = {
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        barcode: formData.barcode,
        pricePurchase: formData.pricePurchase,
        priceSale: formData.priceSale,
        stockMinim: formData.stockMinim,
        active: true,
        categoryId: formData.categoryId,
        units: formData.unitId ? [{ id: formData.unitId }] : [],
        type: formData.type,
      };
      const response = await this.rustService.call(async (bridge) => {
        return await bridge.post('/products', payload);
      });
      this.logger.log(this.onSaveProduct.name, response);
      this.nav.pop();
    } catch (error) {
      this.provideError(error);
    }
  }
}
