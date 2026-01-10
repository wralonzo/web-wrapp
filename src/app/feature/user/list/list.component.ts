import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ConfirmService } from '@core/services/confirm.service';
import { ColumnConfig, FilterConfig, TableActionEvent } from '@shared/models/table';
import { UserService } from '../../../core/services/user.service';
import { User } from '@shared/models/user/user.model';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip, debounceTime, distinctUntilChanged } from 'rxjs';
import { SelectOption } from '@shared/models/select/option.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { RoleService } from '@core/services/roles.service';
import { PageConfiguration } from 'src/app/page-configurations';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { HttpParams } from '@angular/common/http';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';
@Component({
  selector: 'app-list',
  imports: [CommonModule, FormsModule, ButtonComponent, TableListComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: true,
})
export class ListUserComponent extends PageConfiguration implements OnInit {
  private readonly confirmService = inject(ConfirmService);
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);

  public totalItems = signal(0);
  public currentPage = signal(0);
  public totlPages = signal(0);
  public pageSize = signal(10);
  public loading = signal(false);

  private readonly activeParams = signal<Record<string, any>>({
    sort: 'username,asc',
  });

  public users = signal<User[]>([]);
  public searchQuery = signal('');

  public tableColumns: ColumnConfig[] = [
    { key: 'fullName', label: 'Nombres', type: 'text', sortable: true },
    { key: 'username', label: 'usuario', type: 'text', sortable: true },
    { key: 'phone', label: 'Teléfono', type: 'text', sortable: true },
    { key: 'address', label: 'Dirección', type: 'text', sortable: true },
    { key: 'enabled', label: 'Estado', type: 'boolean', sortable: true },
    { key: 'actions', label: '', type: 'action' },
  ];

  public filters = signal<FilterConfig[]>([
    {
      key: 'roleName',
      label: 'Roles',
      selectedName: 'todos',
      options: [{ value: 'ALL', label: 'Todos' }],
    },
  ]);

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
    this.loadRoles();
  }

  public add(): void {
    this.nav.push(APP_ROUTES.nav.users.add);
  }

  private async loadData() {
    try {
      this.loading.set(true);
      const params = {
        ...this.activeParams(),
        term: this.searchQuery() ?? '', // Enviamos el término al backend
        page: this.currentPage(),
        size: this.pageSize(),
      };

      const queryString = new HttpParams({ fromObject: params }).toString();
      const url = `/user?${queryString}`;
      const response: PaginatedResponse<User> = await this.rustSerive.call(async (bridge) => {
        return await bridge.get(url);
      });
      this.users.set(response.content);
      this.totalItems.set(response.totalElements);
      this.totlPages.set(response.totalPages);
      this.logger.log('Usuarios cargados:', this.users());
    } catch (error: any) {
      this.logger.error(this.loadData.name, error);
      this.toast.show(error?.payload?.message);
    }
  }

  private loadRoles() {
    const params = {
      page: 0,
      size: 100,
      sort: 'name,asc',
    };

    this.roleService.find(params).subscribe({
      next: (response) => {
        // Mapeamos los roles del backend al formato SelectOption
        const rolesMapped: SelectOption[] = response.data.content.map((item: any) => ({
          value: item.name,
          label: item.name,
        }));

        // Actualizamos las opciones del filtro (manteniendo "Todos" al inicio)
        this.filters()[0].options.push(...rolesMapped);

        this.logger.info('Filtros de roles actualizados', this.filters()[0].options);
      },
    });
  }

  public filtered = computed(() => {
    this.searchQuery().toLowerCase().trim();
    return this.users();
  });

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

  private goToEdit(user: User) {
    if (user.roles?.find((r) => r === 'ROLE_CLIENTE')) {
      this.logger.log('Navegando a editar cliente con ID:', user.clientId);
      const idClient = user.clientId ? user.clientId : '';
      this.nav.push(APP_ROUTES.nav.clients.edit(idClient));
      return;
    }
    this.logger.log('Navegando a editar usuario con ID:', user.id);
    this.nav.push(APP_ROUTES.nav.users.edit(user.id));
  }

  private async confirmDelete(data: User) {
    const confirmed = await this.confirmService.open({
      title: 'Desactivar usuario',
      message: `¿Estás seguro de desactivar ${data.fullName}?.`,
      btnConfirmText: 'Sí, desactivar ahora',
      btnCancelText: 'No, cancelar',
      variant: 'danger',
    });
    if (confirmed) {
      this.userService.deActivate(data.id).subscribe({
        next: () => {
          this.users.update((currentUsers) =>
            currentUsers.map((user) => {
              user.enabled = false;
              data.enabled = false;
              return user.id === data.id ? { ...user, ...data } : user;
            })
          );
          this.toast.show('Usuario eliminado', 'success');
        },
      });
    }
  }

  private goToView(user: User) {
    if (user.roles?.find((r) => r === 'ROLE_CLIENTE')) {
      this.logger.log('Navegando a ver cliente con ID:', user.clientId);
      this.nav.push(APP_ROUTES.nav.clients.view(user.clientId ?? ''));
      return;
    }

    this.logger.log('Navegando a ver usuario con ID:', user.id);
    this.nav.push(APP_ROUTES.nav.users.view(user.id));
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
}
