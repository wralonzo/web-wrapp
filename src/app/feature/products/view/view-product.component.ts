import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '@shared/models/product/produt-response.interface';
import { ProductUnit } from '@shared/models/product-unit/product-unit.interface';
import { ModalComponent } from '@shared/components/modal-form/modal.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { CustomSelectComponent } from '@shared/components/select/select.component';
import { SelectOption } from '@shared/models/select/option.interface';
import { ProductUnitListService } from '@core/services/products/product-unit-list.service';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [
    CommonModule,
    CustomSelectComponent,
    ModalComponent,
    FormsModule,
    ButtonComponent
  ],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss',
})
export class ViewProductComponent extends PageConfiguration implements OnInit {
  id = signal<number>(0);
  product = signal<Product | null>(null);
  isLoading = signal(true);
  showModal = signal(false);
  isSubmittingUnit = signal(false);
  productUnitListService = inject(ProductUnitListService);

  // Formulario para nueva unidad
  unitData = signal<number>(0);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public productUnits = signal<SelectOption[]>([]);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(Number(id));
      this.loadProduct();
      this.loadProductUnits();
    }
  }

  async loadProduct() {
    this.isLoading.set(true);
    try {
      let response = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return bridge.get(`/products/${this.id()}`);
      });
      const units = await this.loadUnits();
      response.units = units;
      this.product.set(response); // Manejar diferentes formatos de respuesta si es necesario
      this.logger.info(this.loadProduct.name, 'Product loaded:', this.product());
    } catch (error) {
      this.provideError(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadProductUnits() {
    this.isLoading.set(true);
    try {
      const response = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return bridge.get(`/inventory/product-units`);
      });
      const mapping: SelectOption[] = response.map((item: any) => {
        return {
          value: item.id.toString(),
          label: item.name,
        };
      });
      this.productUnits.set(mapping);
      this.logger.info(this.loadProductUnits.name, 'Product units loaded:', this.productUnits());
    } catch (error) {
      this.provideError(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadUnits() {
    this.isLoading.set(true);
    try {
      const response = await this.productUnitListService.list(this.id());
      this.logger.info(this.loadUnits.name, 'Units loaded:', response);
      return response;
    } catch (error) {
      this.provideError(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteUnit(idUnit: number) {
    try {
      await this.productUnitListService.delete(idUnit);
      await this.loadProduct();
      this.toast.show('Unidad eliminada correctamente', 'success');
    } catch (error) {
      this.provideError(error);
    }
  }

  openUnitModal() {
    this.unitData.set(0);
    this.showModal.set(true);
  }

  async saveUnit() {
    if (!this.unitData()) {
      this.toast.show('Por selecciona una unidad de medida.', 'error');
      return;
    }

    this.isSubmittingUnit.set(true);
    try {
      await this.productUnitListService.create(this.id(), this.unitData());

      this.toast.show('Unidad de medida agregada correctamente.', 'success');
      this.showModal.set(false);
      await this.loadProduct(); // Recargar para ver la nueva unidad
    } catch (error) {
      this.provideError(error);
    } finally {
      this.isSubmittingUnit.set(false);
    }
  }

  getInitials(name: string): string {
    return name
      ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
      : 'PR';
  }

  copyToClipboard(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.toast.show('Copiado al portapapeles', 'success');
    });
  }

  editProduct() {
    this.router.navigate(['/app/products/edit', this.id()]);
  }

  goBack() {
    this.router.navigate(['/app/products/list']);
  }

  onSelectChange(value: SelectOption) {
    this.unitData.set(Number(value.value));
  }
}
