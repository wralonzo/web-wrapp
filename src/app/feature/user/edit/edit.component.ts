import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { UserService } from '@core/services/user.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { MultiSelectRolesComponent } from '@shared/components/multi-select/multi-select-roles.component';
import { CustomSelectComponent } from '@shared/components/select/select.component';
import { PositionType } from '@shared/models/position-type/postion-type.interface';
import { Role } from '@shared/models/role/role.interface';
import { SelectOption } from '@shared/models/select/option.interface';
import { UserAdd } from '@shared/models/user/add-user.interface';
import { User } from '@shared/models/user/user.model';
import { Warehouse } from '@shared/models/warehouse/warehouse.interface';
import { PageConfiguration } from 'src/app/page-configurations';

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
export class EditUserComponponent extends PageConfiguration implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public loading = signal(false);
  public loadingData = signal(false);
  public formSubmitted = signal(false);
  public idRecord = signal<number | null>(null);

  public optionsWarehouses = signal<SelectOption[]>([]);
  public optionsRoles: SelectOption[] = [];
  public optionsPositionTypes = signal<SelectOption[]>([]);
  public roleOptions = signal<SelectOption[]>([]);
  public userRoles = signal<string[]>([]);
  submitting = signal(false);

  public user = signal<User | null>(null);


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idRecord.set(+id);
      this.loadWarehouses();
      this.loadPositionTypes();
      this.getData();
      this.loadRoles();
    }
  }

  private async getData() {
    try {
      const response: User = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return bridge.get(`/user/${this.idRecord()!}/profile`);
      });
      this.logger.info('User', response);
      this.user.set(response);
      this.userRoles.set(this.user()!.user.roles!);
      this.loadingData.set(false);
    } catch (error) {
      this.provideError(error);
    }
  }

  private async loadWarehouses() {
    try {
      const response: Warehouse[] = await this.rustService.call(
        async (bridge: GenericHttpBridge) => {
          return bridge.get('/warehouse');
        }
      );
      this.logger.info('Warehouses', response);
      const mapping: SelectOption[] = response.map((item) => {
        return {
          value: item.id.toString(),
          label: item.name,
        };
      });
      this.optionsWarehouses.set(mapping);
    } catch (error) {
      this.provideError(error);
    }
  }

  private async loadPositionTypes() {
    try {
      const params = {
        page: 0,
        size: 100,
        sort: 'name,asc',
      };
      const urlQuery = this.objectToStringQuery(params);
      const response: PaginatedResponse<PositionType> = await this.rustService.call(
        async (bridge: GenericHttpBridge) => {
          return bridge.get(`/position-type?${urlQuery}`);
        }
      );
      this.logger.info('PositionType', response);
      const mapping: SelectOption[] = response.content.map((item) => {
        return {
          value: item.id.toString(),
          label: item.name,
        };
      });
      this.optionsPositionTypes.set(mapping);
    } catch (error) {
      this.provideError(error);
    }
  }

  private async loadRoles() {
    try {
      const params = {
        page: 0,
        size: 100,
        sort: 'name,asc',
      };
      const queryUrl = this.objectToStringQuery(params);
      const response: PaginatedResponse<Role> = await this.rustService.call(
        async (bridge: GenericHttpBridge) => {
          return bridge.get(`/role?s${queryUrl}`);
        }
      );
      this.logger.info('Roles', response);
      const mapping: SelectOption[] = response.content.map((item) => {
        return {
          value: item.name,
          label: item.name,
        };
      });
      this.roleOptions.set(mapping);
    } catch (error) {
      this.provideError(error);
    }
  }

  public async onSubmit(): Promise<void> {
    try {
      this.submitting.set(true);
      const currentUser = this.user();
      if (!currentUser) return;

      const payload = {
        username: currentUser.profile.username,
        fullName: currentUser.profile.fullName,
        birthDate: currentUser.profile.birthDate,
        phone: currentUser.profile.phone || '',
        address: currentUser.profile.address || '',
        email: currentUser.profile.email || '',
        positionTypeId: currentUser.employee?.positionId ?? 0,
        warehouseId: currentUser.employee?.warehouseId ?? 0,
        roles: this.userRoles(),
        password: currentUser.profile.username,
      };

      this.logger.info('User', payload);
      const response = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return await bridge.patch(`/user/${this.idRecord()!}`, payload);
      });

      this.logger.info('User updated', response);
      this.router.navigate(['/app/users']);
      this.toast.show('Usuario actualizado correctamente!', 'success');
    } catch (error) {
      this.provideError(error);
    } finally {
      this.submitting.set(false);
    }
  }

  selectWarehouse(option: SelectOption): void {
    if (this.user()) {
      this.user()!.employee!.warehouseId = Number(option.value);
    }
  }

  selectPositionType(option: SelectOption): void {
    this.user()!.employee!.positionId = Number(option.value);
  }
}
