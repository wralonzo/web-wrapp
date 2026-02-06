import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductBundleService } from '@core/services/product-bundle.service';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { FieldConfig, SelectOption } from '@shared/models/field/field-config.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { ProductBundle } from '@shared/models/inventory/product-bundle.interface';

@Component({
    selector: 'app-add-product-bundle',
    standalone: true,
    imports: [CommonModule, DynamicFormComponent],
    templateUrl: './add-product-bundle.component.html',
    styleUrl: './add-product-bundle.component.scss',
})
export class AddProductBundleComponent extends PageConfiguration implements OnInit {
    public isEditMode = signal(false);
    public bundleId: number | null = null;
    public initialData = signal<any>(null);

    public formConfig: FieldConfig[] = [
        {
            name: 'parentProductId',
            label: 'Producto Principal (Combo)',
            type: 'select',
            required: true,
            colSpan: 2,
            endpoint: '/products',
            mapResponse: (response: any) => response?.content.map((p: any) => ({ label: p.name, value: p.sku })),
        },
        {
            name: 'componentProductId',
            label: 'Producto Componente',
            type: 'select',
            required: true,
            colSpan: 2,
            endpoint: '/products',
            mapResponse: (response: any) => response?.content.map((p: any) => ({ label: p.name, value: p.sku })),
        },
        {
            name: 'quantity',
            label: 'Cantidad',
            type: 'number',
            required: true,
            colSpan: 1,
            valueDefault: 1
        }
    ];

    constructor(
        private productBundleService: ProductBundleService,
        private route: ActivatedRoute
    ) {
        super();
    }

    async ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.bundleId = +idParam;
            this.isEditMode.set(true);
            await this.loadBundle(this.bundleId);
        }
    }

    async loadBundle(id: number) {
        try {
            const bundle = await this.productBundleService.getById(id);
            this.initialData.set(bundle);
        } catch (error) {
            this.provideError(error);
            this.nav.pop();
        }
    }

    async onSave(formData: any) {
        try {
            const payload: ProductBundle = {
                parentProductId: +formData.parentProductId,
                componentProductId: +formData.componentProductId,
                quantity: +formData.quantity,
                ...formData
            };

            if (this.isEditMode() && this.bundleId) {
                await this.productBundleService.update(this.bundleId, payload);
                this.toast.show('Combo actualizado correctamente', 'success');
            } else {
                await this.productBundleService.create(payload);
                this.toast.show('Combo creado correctamente', 'success');
            }
            this.nav.pop();
        } catch (error) {
            this.provideError(error);
        }
    }
}
