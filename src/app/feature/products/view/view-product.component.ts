import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product, ProductBundleResponse } from '@shared/models/product/produt-response.interface';
import { ModalComponent } from '@shared/components/modal-form/modal.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { CustomSelectComponent } from '@shared/components/select/select.component';
import { SelectOption } from '@shared/models/select/option.interface';
import { ProductUnitListService } from '@core/services/products/product-unit-list.service';
import { ProductStock } from '@shared/models/inventory/product-stock.interface';
import { ProductBundleService } from '@core/services/product-bundle.service';
import { ProductService } from '@core/services/product.service';
import { ProductBundle } from '@shared/models/inventory/product-bundle.interface';

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
  bundleItems = signal<ProductBundleResponse[]>([]);
  isLoading = signal(true);
  showModal = signal(false);
  isSubmittingUnit = signal(false);
  productStock = signal<ProductStock[]>([]);
  productUnitListService = inject(ProductUnitListService);
  productBundleService = inject(ProductBundleService);
  productService = inject(ProductService);

  // Formulario para nueva unidad
  unitData = signal<number>(0);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public productUnits = signal<SelectOption[]>([]);

  // Modal Bundle Items
  showBundleModal = signal(false);
  isSubmittingBundle = signal(false);
  bundleComponentId = signal<number>(0);
  bundleQuantity = signal<number>(1);
  public availableProducts = signal<SelectOption[]>([]);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(Number(id));
      this.loadProduct();
      this.loadProductUnits();
      this.loadInventory();
    }
  }

  async loadProduct() {
    this.isLoading.set(true);
    try {
      const response = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return bridge.get(`/products/${this.id()}`);
      });
      const units = await this.loadUnits();
      response.units = units;
      this.product.set(response);

      // Load bundle items if any
      await this.loadBundleItems();

      this.logger.info(this.loadProduct.name, 'Product loaded:', this.product());
    } catch (error) {
      this.provideError(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadBundleItems() {
    try {
      const response = await this.productBundleService.getAllProduct(this.id());
      if (this.product()) {
        this.bundleItems.set(response);
      }
      this.logger.info(this.loadBundleItems.name, 'Bundle items loaded:', response);
    } catch (error) {
      this.provideError(error);
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

  async loadInventory() {
    try {
      const response = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return bridge.get(`/inventory/stock/${this.id()}`);
      });
      this.productStock.set(response || []);
      this.logger.info(this.loadInventory.name, 'Inventory loaded:', this.productStock());
    } catch (error) {
      this.provideError(error);
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

  // Bundle Items Logic
  async loadAvailableProducts() {
    try {
      const response = await this.productService.find().toPromise();
      const mapping: SelectOption[] = response?.data.content.map((p: any) => ({
        label: p.name,
        value: p.id.toString()
      })) || [];
      this.availableProducts.set(mapping);
    } catch (error) {
      this.provideError(error);
    }
  }

  openBundleModal() {
    this.bundleComponentId.set(0);
    this.bundleQuantity.set(1);
    this.loadAvailableProducts();
    this.showBundleModal.set(true);
  }

  async saveBundleItem() {
    if (!this.bundleComponentId()) {
      this.toast.show('Por favor selecciona un producto componente.', 'error');
      return;
    }

    this.isSubmittingBundle.set(true);
    try {
      // const payload: ProductBundle = {
      //   // parentProductId: this.id(),
      //   componentProductId: this.bundleComponentId(),
      //   quantity: this.bundleQuantity()
      // };
      // await this.productBundleService.create(payload);
      // this.toast.show('Producto agregado al combo correctamente.', 'success');
      // this.showBundleModal.set(false);
      // await this.loadProduct();
    } catch (error) {
      this.provideError(error);
    } finally {
      this.isSubmittingBundle.set(false);
    }
  }

  async deleteBundleItem(id: number) {
    try {
      await this.productBundleService.delete(id);
      this.toast.show('Producto eliminado del combo', 'success');
      await this.loadProduct();
    } catch (error) {
      this.provideError(error);
    }
  }

  onBundleProductChange(value: SelectOption) {
    this.bundleComponentId.set(Number(value.value));
  }
}
