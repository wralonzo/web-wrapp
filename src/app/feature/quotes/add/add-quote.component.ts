import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QuoteService } from '@core/services/quote.service';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '@shared/models/field/field-config.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { Quote, QuoteDetail, QuoteStatus } from '@shared/models/inventory/quote.interface';

@Component({
    selector: 'app-add-quote',
    standalone: true,
    imports: [CommonModule, DynamicFormComponent, FormsModule],
    templateUrl: './add-quote.component.html',
    styleUrl: './add-quote.component.scss',
})
export class AddQuoteComponent extends PageConfiguration implements OnInit {
    public isEditMode = signal(false);
    public quoteId: number | null = null;
    public initialData = signal<any>({}); // Header data
    public items = signal<QuoteDetail[]>([]); // Detail data

    public totals = computed(() => {
        let subtotal = 0;
        let discount = 0;
        let taxes = 0;

        this.items().forEach(item => {
            const itemTotal = (item.price * item.quantity);
            subtotal += itemTotal;
            discount += item.discount;
            taxes += item.taxes;
        });

        return {
            subtotal,
            discount,
            taxes,
            total: subtotal - discount + taxes
        };
    });

    public headerFields: FieldConfig[] = [
        {
            name: 'name',
            label: 'Nombre / Título',
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
            // Assuming specific endpoint for clients
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
            name: 'dateExpired',
            label: 'Válida hasta',
            type: 'date',
            required: true,
            colSpan: 2
        },
        {
            name: 'status',
            label: 'Estado',
            type: 'select',
            required: true,
            colSpan: 2,
            options: Object.values(QuoteStatus).map(s => ({ label: s, value: s })),
            valueDefault: QuoteStatus.DRAFT
        }
    ];

    private headerFormValue: any = {};

    constructor(
        private quoteService: QuoteService,
        private route: ActivatedRoute
    ) {
        super();
    }

    async ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.quoteId = +idParam;
            this.isEditMode.set(true);
            await this.loadQuote(this.quoteId);
        } else {
            // Initialize with one empty item
            this.addItem();
        }
    }

    async loadQuote(id: number) {
        try {
            const quote = await this.quoteService.getById(id);
            this.initialData.set(quote);
            this.headerFormValue = quote;
            this.items.set(quote.details || []);
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
                taxes: 0,
                total: 0
            }
        ]);
    }

    removeItem(index: number) {
        this.items.update(curr => curr.filter((_, i) => i !== index));
    }

    calculateItemTotal(item: QuoteDetail): number {
        item.total = (item.quantity * item.price) - item.discount + item.taxes;
        return item.total;
    }

    calculateTotals() {
        // Trigger computed signal re-evaluation by creating a new reference of the array
        // (Angular signals detect changes by reference)
        this.items.update(curr => [...curr]);
    }

    async save() {
        try {
            const totals = this.totals();
            const payload: Quote = {
                ...this.headerFormValue,
                amount: totals.subtotal,
                discount: totals.discount,
                taxes: totals.taxes,
                total: totals.total,
                details: this.items()
            };

            if (this.isEditMode() && this.quoteId) {
                await this.quoteService.update(this.quoteId, payload);
                this.toast.show('Cotización actualizada', 'success');
            } else {
                await this.quoteService.create(payload);
                this.toast.show('Cotización creada', 'success');
            }
            this.nav.pop();
        } catch (error) {
            this.provideError(error);
        }
    }
}
