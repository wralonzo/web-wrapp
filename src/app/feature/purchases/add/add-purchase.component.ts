import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PurchaseService } from '@core/services/purchase.service';
import { CustomSelectComponent } from '@shared/components/select/select.component';

import { PurchaseReceptionRequest, ReceptionItem } from '@shared/models/purchase/purchase.interface';
import { PageConfiguration } from 'src/app/page-configurations';

@Component({
    selector: 'app-add-purchase',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        CustomSelectComponent
    ],
    templateUrl: './add-purchase.component.html',
    styleUrl: './add-purchase.component.scss',
})
export class AddPurchaseComponent extends PageConfiguration {
    public purchaseForm: FormGroup;
    public isSubmitting = signal(false);

    // Options for dropdowns - will be loaded from API
    public suppliers = signal<any[]>([]);
    public warehouses = signal<any[]>([]);
    public products = signal<any[]>([]);

    constructor(
        private fb: FormBuilder,
        private purchaseService: PurchaseService
    ) {
        super();

        this.purchaseForm = this.fb.group({
            supplierId: [null, Validators.required],
            warehouseId: [null, Validators.required],
            branchId: [1, Validators.required], // TODO: Get from user context
            observation: [''],
            items: this.fb.array([])
        });

        this.loadData();
        this.addItem(); // Add first item by default
    }

    get items(): FormArray {
        return this.purchaseForm.get('items') as FormArray;
    }

    async loadData() {
        try {
            // Load suppliers
            const suppliersData = await this.rustService.call(async (bridge) => {
                return await bridge.get('/suppliers?size=100');
            });
            this.suppliers.set((suppliersData.content || suppliersData).map((s: any) => ({
                label: s.name,
                value: s.id
            })));

            // Load warehouses
            const warehousesData = await this.rustService.call(async (bridge) => {
                return await bridge.get('/warehouses?size=100');
            });
            this.warehouses.set((warehousesData.content || warehousesData).map((w: any) => ({
                label: w.name,
                value: w.id
            })));

            // Load products
            const productsData = await this.rustService.call(async (bridge) => {
                return await bridge.get('/products?size=500');
            });
            this.products.set((productsData.content || productsData).map((p: any) => ({
                label: `${p.name} (${p.sku})`,
                value: p.id
            })));

        } catch (error) {
            this.provideError(error);
        }
    }

    createItem(): FormGroup {
        return this.fb.group({
            productId: [null, Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]],
            costPrice: [0, [Validators.required, Validators.min(0)]],
            batchNumber: [''],
            expirationDate: ['']
        });
    }

    addItem() {
        this.items.push(this.createItem());
    }

    removeItem(index: number) {
        if (this.items.length > 1) {
            this.items.removeAt(index);
        } else {
            this.toast.show('Debe tener al menos un producto', 'error');
        }
    }

    onSelectChange(controlName: string, value: any) {
        this.purchaseForm.get(controlName)?.setValue(value?.value || value);
    }

    onItemSelectChange(index: number, controlName: string, value: any) {
        const item = this.items.at(index);
        item.get(controlName)?.setValue(value?.value || value);
    }

    async onSubmit() {
        if (this.purchaseForm.invalid) {
            this.purchaseForm.markAllAsTouched();
            this.toast.show('Por favor complete todos los campos requeridos', 'error');
            return;
        }

        if (this.items.length === 0) {
            this.toast.show('Debe agregar al menos un producto', 'error');
            return;
        }

        try {
            this.isSubmitting.set(true);

            const formValue = this.purchaseForm.value;
            const request: PurchaseReceptionRequest = {
                branchId: formValue.branchId,
                warehouseId: formValue.warehouseId,
                supplierId: formValue.supplierId,
                observation: formValue.observation,
                items: formValue.items.map((item: any) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    costPrice: item.costPrice,
                    batchNumber: item.batchNumber || undefined,
                    expirationDate: item.expirationDate || undefined
                }))
            };

            const response = await this.purchaseService.processPurchaseReception(request);

            if (response.success) {
                this.toast.show(`Compra procesada exitosamente. ${response.itemsProcessed} items agregados al inventario.`, 'success');
                this.nav.pop();
            } else {
                this.toast.show(response.message || 'Error al procesar compra', 'error');
            }

        } catch (error) {
            this.provideError(error);
        } finally {
            this.isSubmitting.set(false);
        }
    }

    getTotalAmount(): number {
        return this.items.controls.reduce((total, item) => {
            const quantity = item.get('quantity')?.value || 0;
            const costPrice = item.get('costPrice')?.value || 0;
            return total + (quantity * costPrice);
        }, 0);
    }
}
