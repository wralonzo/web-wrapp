import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BranchConfig, Product, ProductBundleResponse } from '@shared/models/product/produt-response.interface';
import { ModalComponent } from '@shared/components/modal-form/modal.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ProductSearchComponent } from '@shared/components/product-search/product-search.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { CustomSelectComponent } from '@shared/components/select/select.component';
import { SelectOption } from '@shared/models/select/option.interface';
import { ProductUnitListService } from '@core/services/products/product-unit-list.service';
import { ProductStock } from '@shared/models/inventory/product-stock.interface';
import { ProductBundleService } from '@core/services/product-bundle.service';
import { ProductService } from '@core/services/product.service';
import { ProductBundle } from '@shared/models/inventory/product-bundle.interface';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';
import { Category } from '@shared/models/category/category.interface';
import { Branch } from '@shared/models/branch/branch.interface';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [
    CommonModule,
    CustomSelectComponent,
    ModalComponent,
    FormsModule,
    ButtonComponent,
    ProductSearchComponent
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

  // Modal Branch Config
  showBranchConfigModal = signal(false);
  isSubmittingBranchConfig = signal(false);
  branches = signal<SelectOption[]>([]);
  categories = signal<SelectOption[]>([]);
  branchConfigData = signal({
    branchId: 0,
    categoryId: 0,
    active: true,
    stockMinim: 0
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(Number(id));
      await this.loadProduct();
      this.loadProductUnits();
      this.loadInventory();
      this.loadBranchConfig();
      // Load dependencies for modal
      this.loadBranches();
      this.loadCategories();
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

  async loadBranchConfig() {
    try {
      const response: BranchConfig[] = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return bridge.get(`/branches-config/products/${this.id()}`);
      });
      this.logger.info(this.loadBranchConfig.name, 'Branch config loaded:', response);
      this.product.update(p => p ? { ...p, branchConfigs: response } : null);
    } catch (error) {
      this.provideError(error);
    }
  }

  async loadBranches() {
    try {
      const response: PaginatedResponse<Branch> = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return bridge.get(`/branch`);
      });
      const mapping: SelectOption[] = response.content.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      this.branches.set(mapping);
    } catch (error) {
      this.provideError(error);
    }
  }

  async loadCategories() {
    try {
      const response: PaginatedResponse<Category> = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return bridge.get(`/category`);
      });
      const mapping: SelectOption[] = response.content.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      this.categories.set(mapping);
    } catch (error) {
      this.provideError(error);
    }
  }

  openBranchConfigModal() {
    this.showBranchConfigModal.set(true);
  }

  onBranchConfigSelectChange(field: 'branchId' | 'categoryId', value: SelectOption) {
    this.branchConfigData.update(data => ({ ...data, [field]: Number(value.value) }));
  }

  async saveBranchConfig() {
    const data = this.branchConfigData();
    if (!data.branchId || !data.categoryId) {
      this.toast.show('Por favor seleccione una sucursal y una categoría.', 'error');
      return;
    }

    this.isSubmittingBranchConfig.set(true);
    try {
      await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return bridge.post(`/branches-config/${this.id()}`, data);
      });
      this.toast.show('Configuración de sucursal agregada correctamente.', 'success');
      this.showBranchConfigModal.set(false);
      await this.loadBranchConfig();
    } catch (error) {
      this.provideError(error);
    } finally {
      this.isSubmittingBranchConfig.set(true);
    }
  }

  async deleteBranchConfig(id: number) {
    try {
      await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return bridge.delete(`/branches-config/${id}`);
      });
      this.toast.show('Configuración de sucursal eliminada.', 'success');
      await this.loadBranchConfig();
    } catch (error) {
      this.provideError(error);
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
  openBundleModal() {
    this.bundleComponentId.set(0);
    this.bundleQuantity.set(1);
    this.showBundleModal.set(true);
  }

  async saveBundleItem() {
    if (!this.bundleComponentId()) {
      this.toast.show('Por favor selecciona un producto componente.', 'error');
      return;
    }

    this.isSubmittingBundle.set(true);
    try {
      const payload = {
        childProductId: this.bundleComponentId(),
        quantity: this.bundleQuantity()
      };
      await this.productBundleService.create(this.id(), payload);
      this.toast.show('Producto agregado al combo correctamente.', 'success');
      this.showBundleModal.set(false);
      await this.loadProduct(); // loadProduct llama indirectamente a loadBundleItems
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

  onBundleProductChange(product: Product) {
    if (product.id) {
      this.bundleComponentId.set(product.id);
    }
  }
}
