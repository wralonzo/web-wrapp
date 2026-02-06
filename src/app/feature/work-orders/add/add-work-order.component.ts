import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WorkOrderService } from '@core/services/work-order.service';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '@shared/models/field/field-config.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { WorkOrder, WorkOrderDetail, WorkOrderStatus } from '@shared/models/inventory/work-order.interface';

@Component({
    selector: 'app-add-work-order',
    standalone: true,
    imports: [CommonModule, DynamicFormComponent, FormsModule],
    templateUrl: './add-work-order.component.html',
    styleUrl: './add-work-order.component.scss',
})
export class AddWorkOrderComponent extends PageConfiguration implements OnInit {
    public isEditMode = signal(false);
    public orderId: number | null = null;
    public initialData = signal<any>({});
    public items = signal<WorkOrderDetail[]>([]);
    public headerFormValue: any = {};

    public totals = computed(() => {
        return this.items().reduce((acc, item) => acc + (item.quantity * item.price), 0);
    });

    public headerFields: FieldConfig[] = [
        {
            name: 'name',
            label: 'Asunto / Título',
            type: 'text',
            required: true,
            colSpan: 2
        },
        {
            name: 'description',
            label: 'Descripción Breve',
            type: 'text',
            required: true,
            colSpan: 2
        },
        {
            name: 'clientId',
            label: 'Cliente',
            type: 'select',
            required: true,
            colSpan: 2,
            endpoint: '/client',
            mapResponse: (r: any) => (r.data || r.content || r).map((c: any) => ({ label: c.profile?.fullName || c.name || 'Cliente', value: c.id }))
        },
        {
            name: 'warehouseId',
            label: 'Almacén / Taller',
            type: 'select',
            required: true,
            colSpan: 2,
            endpoint: '/inventory/warehouses',
            mapResponse: (r: any) => (r.data || r).map((w: any) => ({ label: w.name, value: w.id }))
        },
        {
            name: 'status',
            label: 'Estado',
            type: 'select',
            required: true,
            colSpan: 2,
            options: Object.values(WorkOrderStatus).map(s => ({ label: s, value: s })),
            valueDefault: WorkOrderStatus.PENDING
        }
    ];


    constructor(
        private workOrderService: WorkOrderService,
        private route: ActivatedRoute
    ) {
        super();
    }

    async ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.orderId = +idParam;
            this.isEditMode.set(true);
            await this.loadOrder(this.orderId);
        } else {
            this.items.update(curr => []);
        }
    }

    async loadOrder(id: number) {
        try {
            const order = await this.workOrderService.getById(id);
            this.initialData.set(order);
            this.headerFormValue = order;
            this.items.set(order.details || []);
        } catch (error) {
            this.provideError(error);
            this.nav.pop();
        }
    }

    onHeaderChange(value: any) {
        this.headerFormValue = { ...this.headerFormValue, ...value };
    }

    addItem() {
        this.items.update(curr => [
            ...curr,
            {
                productId: 0,
                quantity: 1,
                price: 0,
                discount: 0,
                taxes: 0,
                total: 0
            }
        ]);
    }

    removeItem(index: number) {
        this.items.update(curr => curr.filter((_, i) => i !== index));
    }

    calculateItemTotal(item: WorkOrderDetail): number {
        item.total = (item.quantity * item.price);
        return item.total;
    }

    calculateTotals() {
        this.items.update(curr => [...curr]);
    }

    async save() {
        try {
            const payload: WorkOrder = {
                ...this.headerFormValue,
                details: this.items()
            };

            if (this.isEditMode() && this.orderId) {
                await this.workOrderService.update(this.orderId, payload);
                this.toast.show('Orden actualizada correctamente', 'success');
            } else {
                await this.workOrderService.create(payload);
                this.toast.show('Orden creada correctamente', 'success');
            }
            this.nav.pop();
        } catch (error) {
            this.provideError(error);
        }
    }
}
