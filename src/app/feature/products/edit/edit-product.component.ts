import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '@shared/models/field/field-config.interface';
import { Product, ProductResponse } from '@shared/models/product/produt-response.interface';
import { PageConfiguration } from 'src/app/page-configurations';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, DynamicFormComponent, RouterLink],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
  providers: [ProductService],
})
export class EditProductComponent extends PageConfiguration implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  public idRecord = signal<number | null>(null);
  private readonly router = inject(Router);
  // 1. Crea un signal para los datos cargados
  public initialData = signal<any>(null);
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
      endpoint: '/category', // Tu ruta de Spring Boot
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idRecord.set(+id);
      this.getData();
    }
  }

  // En tu componente .ts
  onSaveProduct(formData: any) {
    console.log('Objeto listo para el backend:', formData);
    const payload: Product = {
      name: formData.name,
      description: formData.description,
      sku: formData.sku,
      barcode: formData.barcode,
      pricePurchase: formData.pricePurchase,
      priceSale: formData.priceSale,
      stockMinim: formData.stockMinim,
      categoryId: formData.categoryId,
    };

    this.productService.update(this.idRecord()!, payload).subscribe({
      next: () => {
        this.toast.show('Producto actualizado con éxito', 'success');
        this.nav.push(this.ROUTES.nav.products.list);
      },
    });
  }

  getData() {
    this.productService.findById(this.idRecord()!).subscribe({
      next: (response: ProductResponse) => {
        this.logger.info('Producto cargado', response.data);
        this.initialData.set(response.data);
      },
      error: () => void this.router.navigate(['/app/products']),
    });
  }
}
