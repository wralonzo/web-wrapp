import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SaleService } from '@core/services/sale.service';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '@shared/models/field/field-config.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { Sale, SaleDetail, SaleStatus, PaymentMethod } from '@shared/models/inventory/sale.interface';

@Component({
    selector: 'app-add-sale',
    standalone: true,
    imports: [CommonModule, DynamicFormComponent, FormsModule],
    templateUrl: './add-sale.component.html',
    styleUrl: './add-sale.component.scss',
})
export class AddSaleComponent extends PageConfiguration implements OnInit {
    public isEditMode = signal(false);
    public saleId: number | null = null;
    public initialData = signal<any>({}); // Header data
    public items = signal<SaleDetail[]>([]); // Detail data

    public totals = computed(() => {
        let subtotal = 0;
        let discount = 0;
        let tax = 0;

        this.items().forEach(item => {
            // Recalculate item total just in case
            const itemGross = item.quantity * item.price;
            subtotal += itemGross;
            discount += item.discount || 0;
            // Assuming tax is calculated per item logic or simple flat, following quote pattern
            // If tax is a value per item:
            // tax += item.tax || 0; 
            // The Quote example had 'taxes' in detail. SaleDetail has 'total'.
            // Let's assume we maintain data integrity in calculateItemTotal
        });

        // Summing up from items for display. 
        // In this simple version, let's sum the 'total' of items.
        // But for breakdown (Subtotal, Tax, Discount) we need those values per item.
        // SaleDetail interface has: quantity, price, discount, total. It misses explicit 'tax' field compared to QuoteDetail.
        // I will assume for now Tax is 0 or part of the logic not fully in interface yet, or I should add it.
        // Checking SaleDetail interface again: quantity, price, discount, total. No 'tax' field.
        // So I will calculate basic totals.

        let finalTotal = 0;
        this.items().forEach(item => {
            finalTotal += item.total;
        });

        // Re-calcing subtotal/discount from items if needed for display
        // Subtotal = sum(price * qty)
        // Discount = sum(discount)

        return {
            subtotal,
            discount,
            tax, // No tax field in SaleDetail, so 0 for now
            total: finalTotal
        };
    });

    public headerFields: FieldConfig[] = [
        {
            name: 'clientId',
            label: 'Cliente',
            type: 'select',
            required: true,
            colSpan: 2,
            endpoint: '/clients',
            mapResponse: (r: any) => (r.data || r).map((c: any) => ({ label: c.name + ' ' + (c.lastName || ''), value: c.id }))
        },
        {
            name: 'warehouseId',
            label: 'Almacén',
            type: 'select',
            required: true,
            colSpan: 2,
            endpoint: '/inventory/warehouses',
            mapResponse: (r: any) => (r.data || r).map((w: any) => ({ label: w.name, value: w.id }))

        },
        {
            name: 'date',
            label: 'Fecha',
            type: 'date',
            required: true,
            colSpan: 2
        },
        {
            name: 'paymentMethod',
            label: 'Método de Pago',
            type: 'select',
            required: true,
            colSpan: 2,
            options: Object.values(PaymentMethod).map(m => ({ label: m, value: m })),
            valueDefault: PaymentMethod.CASH
        },
        {
            name: 'status',
            label: 'Estado',
            type: 'select',
            required: true,
            colSpan: 2,
            options: Object.values(SaleStatus).map(s => ({ label: s, value: s })),
            valueDefault: SaleStatus.PENDING
        },
        {
            name: 'notes',
            label: 'Notas',
            type: 'text', // Should vary if textArea supported, using text for now or simple input
            required: false,
            colSpan: 2
        }
    ];

    private headerFormValue: any = {};

    constructor(
        private saleService: SaleService,
        private route: ActivatedRoute
    ) {
        super();
    }

    async ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.saleId = +idParam;
            this.isEditMode.set(true);
            await this.loadSale(this.saleId);
        } else {
            // Initialize with one empty item
            this.addItem();
        }
    }

    async loadSale(id: number) {
        try {
            const sale = await this.saleService.getById(id);
            this.initialData.set(sale);
            this.headerFormValue = sale;
            this.items.set(sale.details || []);
        } catch (error) {
            this.provideError(error);
            this.nav.pop();
        }
    }

    onHeaderChange(value: any) {
        this.headerFormValue = value;
    }

    addItem() {
        this.items.update(curr => [
            ...curr,
            {
                productId: 0, // Placeholder
                quantity: 1,
                price: 0,
                discount: 0,
                total: 0
            }
        ]);
    }

    removeItem(index: number) {
        this.items.update(curr => curr.filter((_, i) => i !== index));
    }

    calculateItemTotal(item: SaleDetail): number {
        // Simple calc: (price * qty) - discount
        item.total = (item.quantity * item.price) - (item.discount || 0);
        return item.total;
    }

    calculateTotals() {
        this.items.update(curr => [...curr]);
    }

    async save() {
        try {
            const totals = this.totals();
            const payload: Sale = {
                ...this.headerFormValue,
                subtotal: totals.subtotal,
                tax: totals.tax,
                total: totals.total,
                details: this.items()
            };

            if (this.isEditMode() && this.saleId) {
                await this.saleService.update(this.saleId, payload);
                this.toast.show('Venta actualizada', 'success');
            } else {
                await this.saleService.create(payload);
                this.toast.show('Venta creada', 'success');
            }
            this.nav.pop();
        } catch (error) {
            this.provideError(error);
        }
    }
}
