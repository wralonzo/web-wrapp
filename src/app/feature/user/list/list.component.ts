import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmService } from '@core/services/confirm.service';
import { LoggerService } from '@core/services/logger.service';
import { ToastService } from '@core/services/toast.service';
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

@Component({
  selector: 'app-list',
  imports: [CommonModule, FormsModule, ButtonComponent, TableListComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: true,
})
export class ListUserComponent implements OnInit {
  private logger = inject(LoggerService);
  private router = inject(Router);
  private confirmService = inject(ConfirmService);
  private toast = inject(ToastService);
  private userService = inject(UserService);
  private roleService = inject(RoleService);

  public totalItems = signal(0);
  public currentPage = signal(0);
  public totlPages = signal(0);
  public pageSize = signal(10);
  public loading = signal(false);

  private activeParams = signal<Record<string, any>>({
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
      options: [
        { value: 'ALL', label: 'Todos' },
      ],
    },
  ]);

  constructor() {
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
    this.router.navigate(['/app/users/add']);
  }

  private loadData() {
    this.loading.set(true);
    const params = {
      ...this.activeParams(),
      term: this.searchQuery() ?? '', // Enviamos el término al backend
      page: this.currentPage(),
      size: this.pageSize(),
    };

    this.userService.get(params).subscribe({
      next: (response) => {
        this.users.set(response.data.content);
        this.totalItems.set(response.data.totalElements);
        this.totlPages.set(response.data.totalPages);
        this.loading.set(false);
        this.logger.log('Usuarios cargados:', this.users());
      },
      error: (err) => {
        this.logger.error('Error al cargar los datos:', err);
      },
    });
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
      this.router.navigate(['/app/clients/edit', user.clientId]);
      return;
    }
    this.logger.log('Navegando a editar usuario con ID:', user.id);
    this.router.navigate(['/app/users/edit', user.id]);
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
      this.router.navigate(['/app/clients/view', user.clientId]);
      return;
    }

    this.logger.log('Navegando a ver usuario con ID:', user.id);
    this.router.navigate(['/app/users/view', user.id]);
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
