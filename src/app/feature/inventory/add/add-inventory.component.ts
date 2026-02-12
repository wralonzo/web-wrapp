import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InventoryService } from '@core/services/inventory.service';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '@shared/models/field/field-config.interface';
import { InventoryLoadRequest, InventoryLoadResponse } from '@shared/models/inventory/inventory-load.interface';
import { PageConfiguration } from 'src/app/page-configurations';

@Component({
    selector: 'app-add-inventory',
    standalone: true,
    imports: [CommonModule, DynamicFormComponent, RouterLink],
    templateUrl: './add-inventory.component.html',
    styleUrl: './add-inventory.component.scss',
})
export class AddInventoryComponent extends PageConfiguration {
    public activeTab = signal<'manual' | 'excel'>('manual');
    public loadingExcel = signal(false);
    public excelResponse = signal<InventoryLoadResponse | null>(null);
    public selectedFile = signal<File | null>(null);

    public inventoryLoadFormConfig: FieldConfig[] = [
        {
            name: 'productId',
            label: 'Producto',
            type: 'select',
            required: true,
            colSpan: 1,
            endpoint: '/products',
            mapResponse: (r: any) => (r.content || r).map((p: any) => ({
                label: `${p.name} (${p.sku})`,
                value: p.id
            }))
        },
        {
            name: 'warehouseId',
            label: 'Almacén',
            type: 'select',
            required: true,
            colSpan: 1,
            endpoint: '/warehouses',
            mapResponse: (r: any) => (r.content || r).map((w: any) => ({
                label: w.name,
                value: w.id
            }))
        },
        {
            name: 'quantity',
            label: 'Cantidad',
            type: 'number',
            required: true,
            colSpan: 1,
            valueDefault: 1,
        },
        {
            name: 'supplierId',
            label: 'Proveedor (Opcional)',
            type: 'select',
            required: false,
            colSpan: 1,
            endpoint: '/suppliers',
            mapResponse: (r: any) => (r.content || r).map((s: any) => ({
                label: s.name,
                value: s.id
            }))
        },
        {
            name: 'batchNumber',
            label: 'Número de Lote (Opcional)',
            type: 'text',
            required: false,
            colSpan: 1,
        },
        {
            name: 'expirationDate',
            label: 'Fecha de Expiración (Opcional)',
            type: 'date',
            required: false,
            colSpan: 1,
        },
        {
            name: 'notes',
            label: 'Notas',
            type: 'textarea',
            required: false,
            colSpan: 1,
        },
    ];

    constructor(private inventoryService: InventoryService) {
        super();
    }

    async onLoadInventory(formData: any) {
        try {
            const request: InventoryLoadRequest = {
                productId: formData.productId,
                warehouseId: formData.warehouseId,
                quantity: formData.quantity,
                supplierId: formData.supplierId,
                batchNumber: formData.batchNumber,
                expirationDate: formData.expirationDate,
                notes: formData.notes,
            };

            const response = await this.inventoryService.loadInventory(request);

            if (response.success) {
                this.toast.show('Inventario cargado exitosamente', 'success');
                this.nav.pop();
            } else {
                this.provideError(response.message || 'Error al cargar inventario');
            }
        } catch (error) {
            this.provideError(error);
        }
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile.set(file);
        }
    }

    async onUploadExcel() {
        const file = this.selectedFile();
        if (!file) {
            this.provideError('Por favor selecciona un archivo Excel');
            return;
        }

        try {
            this.loadingExcel.set(true);
            const response = await this.inventoryService.loadInventoryFromExcel(file);
            this.excelResponse.set(response);

            if (response.success) {
                this.toast.show(`${response.itemsProcessed} items cargados exitosamente`, 'success');
                this.selectedFile.set(null);
                // Reset file input
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } else {
                this.provideError(response.message || 'Error al procesar archivo Excel');
            }
        } catch (error) {
            this.provideError(error);
        } finally {
            this.loadingExcel.set(false);
        }
    }

    downloadExcelTemplate() {
        // Create a simple CSV template
        const headers = ['SKU', 'Producto', 'Almacén ID', 'Cantidad', 'Proveedor ID', 'Lote', 'Fecha Exp (YYYY-MM-DD)', 'Notas'];
        const exampleRow = ['ABC123', 'Producto Ejemplo', '1', '100', '1', 'LOTE001', '2026-12-31', 'Carga inicial'];

        const csvContent = [
            headers.join(','),
            exampleRow.join(',')
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'plantilla_carga_inventario.csv');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
