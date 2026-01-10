import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ConfirmService } from '@core/services/confirm.service';
import { ReservationService } from '@core/services/reservation.service';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { Reservation } from '@shared/models/reservation/reservation.interface';
import { SelectOption } from '@shared/models/select/option.interface';
import { ColumnConfig, FilterConfig, TableActionEvent } from '@shared/models/table';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs';
import { PageConfiguration } from 'src/app/page-configurations';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-list',
  imports: [CommonModule, FormsModule, ButtonComponent, TableListComponent],
  templateUrl: './list-reservation.component.html',
  styleUrl: './list-reservation.component.scss',
  providers: [ReservationService],
})
export class ListReservationComponent extends PageConfiguration {
  private readonly confirmService = inject(ConfirmService);
  private readonly reservationService = inject(ReservationService);

  public totalItems = signal(0);
  public currentPage = signal(0);
  public totlPages = signal(0);
  public pageSize = signal(10);
  public loading = signal(false);
  public selectedFile = signal<File | null>(null);
  public isUploading = false;
  public showModal = signal(false);

  private activeParams = signal<Record<string, any>>({
    sort: 'id,desc',
  });
  public reservations = signal<Reservation[]>([]);
  public searchQuery = signal('');

  public filters = signal<FilterConfig[]>([
    {
      key: 'categoryId',
      label: 'Filtrar por Estado',
      selectedName: 'todos',
      options: [{ value: 'ALL', label: 'Todos' }],
    },
  ]);

  public tableColumns: ColumnConfig[] = [
    { key: 'clientName', label: 'Cliente', type: 'text', sortable: true },
    { key: 'employeeName', label: 'Empleado', type: 'text', sortable: true },
    { key: 'warehouseName', label: 'Sucursal', type: 'text', sortable: true },
    { key: 'reservationDate', label: 'Fecha', type: 'date', sortable: true },
    { key: 'state', label: 'Estado', type: 'badge', sortable: true },
    { key: 'startTime', label: 'Inicio', type: 'badge', sortable: true },
    { key: 'finishDate', label: 'Final', type: 'badge', sortable: true },
    { key: 'type', label: 'Tipo', type: 'badge', sortable: true },
    { key: 'actions', label: '', type: 'action' },
  ];

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
        this.loadData();
      });

    // 2. Manejo de tamaño de página (sin debounce o muy corto)
    toObservable(this.pageSize)
      .pipe(
        skip(1), // <--- Ignora el valor inicial
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.currentPage.set(0);
        this.loadData();
      });
  }

  ngOnInit(): void {
    this.loadData();
  }

  handleTableAction(event: TableActionEvent) {
    const { type, item } = event;

    switch (type) {
      case 'edit':
        this.goToEdit(item);
        break;
      case 'delete':
        this.confirmDelete(item);
        break;
      case 'view':
        this.goToView(item);
        break;
      default:
        this.logger.warnign('Acción no reconocida:', type);
    }
  }

  public filtered = computed(() => {
    this.searchQuery().toLowerCase().trim();
    return this.reservations();
  });

  public add(): void {
    this.nav.push(this.ROUTES.nav.reservations.add);
  }

  private goToEdit(reservation: Reservation) {
    this.logger.log('Navegando a editar producto con ID:', reservation.id);
    this.nav.push(this.ROUTES.nav.products.edit(reservation.id!));
  }

  private goToView(reservation: Reservation) {
    this.logger.log('Navegando a ver producto con ID:', reservation.id);
    this.nav.push(this.ROUTES.nav.products.view(reservation.id!));
  }

  private async confirmDelete(data: Reservation) {
    const confirmed = await this.confirmService.open({
      title: 'Eliminar Reservación',
      message: `¿Estás seguro de desactivar?`,
      btnConfirmText: 'Sí, desactivar',
      btnCancelText: 'No, cancelar',
      variant: 'danger',
    });
    if (confirmed) {
      this.reservationService.delete(data.id!).subscribe({
        next: () => {
          this.reservations.update((current) =>
            current.map((reservation) => {
              return reservation.id === data.id ? { ...reservation, ...data } : reservation;
            })
          );
          this.toast.show('Producto Desactivado', 'success');
        },
      });
    }
  }

  handleFilter(filterUpdate: Record<string, any>) {
    // 1. Extraemos la llave y el valor (ej: key='status', value='VIP')
    const [key, value] = Object.entries(filterUpdate)[0] as [string, SelectOption];
    this.logger.info('Filtro cambiado:', { key, value });
    if (value.value === 'ALL') {
      value.value = '';
    }
    this.activeParams.update((prev) => ({ ...prev, [key]: value.value }));
    this.filters()[0].selectedName = String(value.value);
    this.currentPage.set(0);
    this.loadData();
  }

  handleSort(event: { key: string; dir: 'asc' | 'desc' }) {
    this.activeParams.update((prev) => ({
      sort: `${event.key},${event.dir}`,
    }));
    this.logger.info('Ordenando por:', event);
    this.loadData();
  }

  handlePage(page: number) {
    this.currentPage.set(page);
    this.loadData();
  }

  public loadData() {
    this.loading.set(true);
    const params: Record<string, string | number> = {
      ...this.activeParams(),
      term: this.searchQuery() ?? '',
      page: this.currentPage(),
      size: this.pageSize(),
    };

    this.reservationService.find(params).subscribe({
      next: (response) => {
        this.reservations.set(response.data.content);
        this.totalItems.set(response.data.totalElements);
        this.totlPages.set(response.data.totalPages);
        this.logger.log('Productos cargados:', this.reservations());
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  // 1. Capturar el archivo cuando el usuario lo selecciona
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      return this.selectedFile.set(file);
    }
    return this.selectedFile.set(null);
  }
}
