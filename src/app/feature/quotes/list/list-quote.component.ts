import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuoteService } from '@core/services/quote.service';
import { Quote } from '@shared/models/inventory/quote.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { ColumnConfig } from '@shared/models/table/column-config';
import { TableActionEvent } from '@shared/models/table/table-event.interface';
import { APP_ROUTES } from '@core/constants/routes.constants';

@Component({
    selector: 'app-list-quote',
    standalone: true,
    imports: [CommonModule, RouterLink, TableListComponent],
    templateUrl: './list-quote.component.html',
    styleUrl: './list-quote.component.scss',
})
export class ListQuoteComponent extends PageConfiguration implements OnInit {
    public quotes = signal<Quote[]>([]);

    // Pagination & Search signals
    public currentPage = signal(0);
    public pageSize = signal(10);
    public searchQuery = signal('');
    public totalItems = computed(() => this.quotes().length);
    public totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

    public availableColumns: ColumnConfig[] = [
        { key: 'referenceNumber', label: 'Referencia', type: 'text', sortable: true },
        { key: 'clientName', label: 'Cliente', type: 'text', sortable: true },
        { key: 'createdAt', label: 'Fecha', type: 'date', sortable: true },
        { key: 'total', label: 'Total', type: 'currency', sortable: true },
        { key: 'status', label: 'Estado', type: 'badge', sortable: true, color: 'blue' }, // Defaulting to blue for now
        { key: 'actions', label: 'Acciones', type: 'action' }
    ];

    constructor(private quoteService: QuoteService) {
        super();
    }

    async ngOnInit() {
        await this.loadQuotes();
    }

    public filteredQuotes = computed(() => {
        const query = this.searchQuery().toLowerCase();
        let filtered = this.quotes().filter(q =>
            (q.referenceNumber || '').toLowerCase().includes(query) ||
            (q.clientName || '').toLowerCase().includes(query) ||
            q.status.toLowerCase().includes(query)
        );

        const start = this.currentPage() * this.pageSize();
        const end = start + this.pageSize();
        return filtered.slice(start, end);
    });

    async loadQuotes() {
        try {
            const data = await this.quoteService.getAll();
            this.quotes.set(data.content);
        } catch (error) {
            this.provideError(error);
        }
    }

    handleTableAction(event: TableActionEvent) {
        const { type, item } = event;
        switch (type) {
            case 'edit':
                this.nav.push(`app/quotes/edit/${item.id}`);
                break;
            case 'delete':
                this.deleteQuote(item);
                break;
            default:
                console.warn('Unknown action', type);
        }
    }

    handleSearch(term: string) {
        this.searchQuery.set(term);
        this.currentPage.set(0);
    }

    async deleteQuote(quote: Quote) {
        if (!confirm(`¿Estás seguro de eliminar la cotización?`)) return;

        try {
            if (quote.id) {
                await this.quoteService.delete(quote.id);
                await this.loadQuotes();
                this.toast.show('Cotización eliminada correctamente', 'success');
            }
        } catch (error) {
            this.provideError(error);
        }
    }
}
