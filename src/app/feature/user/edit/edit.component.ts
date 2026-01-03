import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoggerService } from '@core/services/logger.service';
import { PositionTypeService } from '@core/services/position-type.service';
import { RoleService } from '@core/services/roles.service';
import { ToastService } from '@core/services/toast.service';
import { UserService } from '@core/services/user.service';
import { WarehouseService } from '@core/services/warehouse.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { MultiSelectRolesComponent } from '@shared/components/multi-select/multi-select-roles.component';
import { CustomSelectComponent } from '@shared/components/select/select.component';
import { SelectOption } from '@shared/models/select/option.interface';
import { UserAdd } from '@shared/models/user/add-user.interface';
import { User } from '@shared/models/user/user.model';
import { Warehouse } from '@shared/models/warehouse/warehouse.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit',
  imports: [
    CommonModule,
    ButtonComponent,
    CustomSelectComponent,
    FormsModule,
    InputComponent,
    RouterLink,
    MultiSelectRolesComponent,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditUserComponponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private positionTypeService = inject(PositionTypeService);
  private roleService = inject(RoleService);
  private warehouseService = inject(WarehouseService);
  private toastService = inject(ToastService);
  private logger = inject(LoggerService);

  public loading = signal(false);
  public loadingData = signal(false);
  public formSubmitted = signal(false);
  public idRecord = signal<number | null>(null);

  public optionsWarehouses = signal<SelectOption[]>([]);
  public optionsRoles: SelectOption[] = [];
  public optionsPositionTypes: SelectOption[] = [];
  public roleOptions: SelectOption[] = [];
  public userRoles = signal<string[]>([]);
  submitting = signal(false);

  public user!: User;

  public userAdd: UserAdd = {
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idRecord.set(+id);
      this.getData();
      this.loadWarehouses();
      this.loadPositionTypes();
      this.loadRoles();
    }
  }

  private getData(): Subscription {
    this.loadingData.set(true);
    return this.userService.getById(this.idRecord()!).subscribe({
      next: (response: any) => {
        this.logger.info('User', response);
        this.user = { ...response.data };
        this.userRoles.set(this.user!.roles!);
        this.loadingData.set(false);
      },
      error: () => this.router.navigate(['/app/users']),
    });
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

  public onSubmit(): void {
    this.submitting.set(true);
    this.userAdd.roles = this.userRoles();
    this.userAdd.user = this.user;
    this.userAdd.positionType = this.user.employee?.positionId;
    this.userAdd.warehouse = this.user?.employee?.warehouseId;
    this.userService.update(+this.idRecord()!, this.userAdd).subscribe(() => {
      this.router.navigate(['/app/users']);
      this.toastService.show('Usuario actualizado correctamente!', 'success');
    });
    this.submitting.set(false);
  }

  selectWarehouse(option: SelectOption): void {
    if (this.user) {
      this.userAdd.warehouse = Number(option.value);
    }
  }

  selectPositionType(option: SelectOption): void {
    this.userAdd.positionType = Number(option.value);
  }
}
