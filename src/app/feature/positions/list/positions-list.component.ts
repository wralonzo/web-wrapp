import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PositionType } from '@shared/models/position-type/position-type.interface';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { ColumnConfig, FilterConfig, TableActionEvent } from '@shared/models/table';
import { ConfirmService } from '@core/services/confirm.service';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip, debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { SelectOption } from '@shared/models/select/option.interface';

@Component({
    selector: 'app-positions-list',
    standalone: true,
    imports: [CommonModule, ButtonComponent, TableListComponent],
    templateUrl: './positions-list.component.html',
})
export class PositionsListComponent extends PageConfiguration implements OnInit {
    private readonly confirmService = inject(ConfirmService);

    public positions = signal<PositionType[]>([]);
    public loading = signal<boolean>(false);
    public searchQuery = signal('');

    private readonly activeParams = signal<Record<string, any>>({
        sort: 'id,asc',
    });

    public totalItems = signal(0);
    public currentPage = signal(0);
    public totalPages = signal(0);
    public pageSize = signal(10);

    public tableColumns: ColumnConfig[] = [
        { key: 'id', label: 'ID', type: 'text', sortable: true },
        { key: 'name', label: 'Nombre del Puesto', type: 'text', sortable: true },
        { key: 'level', label: 'Nivel/Jerarquía', type: 'text', sortable: true },
        { key: 'actions', label: '', type: 'action' },
    ];

    public filters = signal<FilterConfig[]>([]);

    constructor() {
        super();
        toObservable(this.searchQuery)
            .pipe(
                skip(1), // <--- IMPORTANTE: Ignora el valor inicial al cargar
                debounceTime(2000), // 400ms es más natural que 2000ms
                distinctUntilChanged(),
                takeUntilDestroyed()
            )
            .subscribe(() => {
                this.currentPage.set(0);
                this.loadPositions();
            });

        // 2. Manejo de tamaño de página (sin debounce o muy corto)
        toObservable(this.pageSize)
            .pipe(
                skip(1), // <--- Ignora el valor inicial
                takeUntilDestroyed()
            )
            .subscribe(() => {
                this.currentPage.set(0);
                this.loadPositions();
            });
    }

    ngOnInit(): void {
        this.loadPositions();
    }

    async loadPositions() {
        this.loading.set(true);
        try {
            const params = {
                ...this.activeParams(),
                term: this.searchQuery() ?? '', // Enviamos el término al backend
                page: this.currentPage(),
                size: this.pageSize(),
            };
            const queryString = new HttpParams({ fromObject: params }).toString();
            const response: PaginatedResponse<PositionType> = await this.rustService.call(async (bridge: GenericHttpBridge) => {
                return await bridge.get(`/position-type?${queryString}`);
            });
            this.logger.info(this.loadPositions.name, response);
            this.positions.set(response.content);
            this.totalItems.set(response.totalElements);
            this.currentPage.set(response.totalPages);
            this.totalPages.set(response.totalPages);
            this.pageSize.set(response.size);
        } catch (error) {
            this.provideError(error);
        } finally {
            this.loading.set(false);
        }
    }

    handleTableAction(event: TableActionEvent) {
        const { type, item } = event;
        switch (type) {
            case 'edit':
                this.goToEdit(item.id);
                break;
            case 'delete':
                this.deletePosition(item.id);
                break;
            default:
                this.logger.warnign('Acción no reconocida:', type);
        }
    }

    goToAdd() {
        this.nav.push(APP_ROUTES.nav.positions.add);
    }

    goToEdit(id: number) {
        this.nav.push(APP_ROUTES.nav.positions.edit(id));
    }

    async deletePosition(id: number) {
        const confirmed = await this.confirmService.open({
            title: 'Eliminar Puesto',
            message: '¿Estás seguro de que deseas eliminar este puesto de trabajo? Esta acción no se puede deshacer.',
            btnConfirmText: 'Eliminar',
            btnCancelText: 'Cancelar',
            variant: 'danger',
        });

        if (confirmed) {
            try {
                await this.rustService.call(async (bridge: GenericHttpBridge) => {
                    return await bridge.patch(`/position_type/${id}/delete`, {});
                });
                this.toast.show('Puesto eliminado correctamente', 'success');
                this.loadPositions();
            } catch (error) {
                this.provideError(error);
            }
        }
    }


    public filtered = computed(() => {
        this.searchQuery().toLowerCase().trim();
        return this.positions();
    });

    public handleCheckboxChange() {
        this.loadPositions();
    }

    handleSort(event: { key: string; dir: 'asc' | 'desc' }) {
        this.activeParams.update((prev) => ({
            sort: `${event.key},${event.dir}`,
        }));
        this.logger.info('Ordenando por:', event);
        this.loadPositions();
    }

    handlePage(page: number) {
        this.currentPage.set(page);
        this.loadPositions();
    }

    handleFilter(filterUpdate: Record<string, any>) {
        // 1. Extraemos la llave y el valor (ej: key='status', value='VIP')
        const [key, value] = Object.entries(filterUpdate)[0] as [string, SelectOption];
        this.logger.info('Filtro cambiado:', { key, value });
        if (value.value === 'ALL') {
            value.value = '';
        }
        this.activeParams.update((prev) => ({ ...prev, [key]: value.value }));
        this.currentPage.set(0);
        this.loadPositions();
    }
}
