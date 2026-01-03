import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PositionTypeService } from '@core/services/position-type.service';
import { RoleService } from '@core/services/roles.service';
import { ToastService } from '@core/services/toast.service';
import { UserService } from '@core/services/user.service';
import { SelectOption } from '@shared/models/select/option.interface';
import { UserAdd } from '@shared/models/user/add-user.interface';
import { AddViewModule } from '@shared/modules/add-view/add-view.module';
import { FormsModule, NgForm } from '@angular/forms';
import { WarehouseService } from '@core/services/warehouse.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { CustomSelectComponent } from '@shared/components/select/select.component';
import { Warehouse } from '@shared/models/warehouse/warehouse.interface';
import { LoggerService } from '@core/services/logger.service';
import { MultiSelectRolesComponent } from '@shared/components/multi-select/multi-select-roles.component';

@Component({
  selector: 'app-add',
  imports: [
    CommonModule,
    ButtonComponent,
    CustomSelectComponent,
    FormsModule,
    InputComponent,
    RouterLink,
    MultiSelectRolesComponent,
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddUserComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  private positionTypeService = inject(PositionTypeService);
  private roleService = inject(RoleService);
  private warehouseService = inject(WarehouseService);
  private toastService = inject(ToastService);
  private logger = inject(LoggerService);
  
  public loading = signal(false);
  public formSubmitted = signal(false);

  public optionsWarehouses = signal<SelectOption[]>([]);
  public optionsRoles: SelectOption[] = [];
  public optionsPositionTypes: SelectOption[] = [];
  public roleOptions: SelectOption[] = [];
  public userRoles = signal<string[]>([]);

  public user: UserAdd = {
    warehouse: 0,
    positionType: 0,
    roles: [],
    user: {
      fullName: '',
      username: '',
      phone: '',
      address: '',
    },
  };

  ngOnInit(): void {
    this.loadWarehouses();
    this.loadPositionTypes();
    this.loadRoles();
  }

  private loadWarehouses(): Subscription {
    return this.warehouseService.find().subscribe({
      next: (response) => {
        this.logger.info('Warehouses', response);
        const data = response.data as Warehouse[];
        const mapping: SelectOption[] = data.map((item) => {
          return {
            value: item.id.toString(),
            label: item.name,
          };
        });
        this.optionsWarehouses.set(mapping);
      },
    });
  }

  private loadPositionTypes(): Subscription {
    const params = {
      page: 0,
      size: 100,
      sort: 'name,asc',
    };
    return this.positionTypeService.find(params).subscribe({
      next: (response) => {
        this.logger.info('PositionType', response);
        const mapping: SelectOption[] = response.data.content.map((item) => {
          return {
            value: item.id.toString(),
            label: item.name,
          };
        });
        this.optionsPositionTypes = mapping;
      },
    });
  }

  private loadRoles(): Subscription {
    const params = {
      page: 0,
      size: 100,
      sort: 'name,asc',
    };
    return this.roleService.find(params).subscribe({
      next: (response) => {
        this.logger.info('Roles', response);
        const mapping: SelectOption[] = response.data.content.map((item) => {
          return {
            value: item.name,
            label: item.name,
          };
        });
        this.roleOptions = mapping;
      },
    });
  }

  public register(form: NgForm): void {
    this.formSubmitted.set(true);
    if (form.invalid) {
      this.toastService.show('Por favor, completa todos los campos requeridos.', 'error');
      return;
    }

    if (!this.user.warehouse) {
      this.toastService.show('Por favor, selecciona un almacen.', 'error');
      return;
    }

    if (!this.user.positionType) {
      this.toastService.show('Por favor, selecciona una posición.', 'error');
      return;
    }
    this.loading.set(true);
    this.user.roles = this.userRoles();
    this.userService.create(this.user).subscribe({
      next: (response) => {
        this.toastService.show('Usuario agregado correctamente');
        this.router.navigate(['/app/users']);
      },
    });
    this.loading.set(false);
  }

  selectWarehouse(option: SelectOption) {
    this.user.warehouse = Number(option.value); // Guardas el valor
  }

  selectPositionType(option: SelectOption) {
    this.user.positionType = Number(option.value); // Guardas el valor
  }
}
