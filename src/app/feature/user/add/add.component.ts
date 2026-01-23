import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SelectOption } from '@shared/models/select/option.interface';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { CustomSelectComponent } from '@shared/components/select/select.component';
import { Warehouse } from '@shared/models/warehouse/warehouse.interface';
import { MultiSelectRolesComponent } from '@shared/components/multi-select/multi-select-roles.component';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';
import { PositionType } from '@shared/models/position-type/postion-type.interface';
import { Role } from '@shared/models/role/role.interface';
import { UserAdd } from '@shared/models/user/add-user.interface';
import { User } from '@assets/retail-shop/User';

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
export class AddUserComponent extends PageConfiguration implements OnInit {
  private readonly router = inject(Router);

  public loading = signal(false);
  public formSubmitted = signal(false);

  public optionsWarehouses = signal<SelectOption[]>([]);
  public optionsRoles: SelectOption[] = [];
  public optionsPositionTypes: SelectOption[] = [];
  public roleOptions = signal<SelectOption[]>([]);
  public userRoles = signal<string[]>([]);

  public user: User = {
    user: {
      id: 0,
      enabled: false,
      provider: '',
      roles: [],
      token: null
    },
    employee: {
      id: 0,
      warehouseId: 0,
      positionName: '',
      positionId: 0
    },
    profile: {
      fullName: '',
      username: '',
      phone: '',
      address: '',
      email: '',
      id: 0,
      provider: '',
      passwordInit: null,
      avatar: null,
      birthDate: null
    },
  };

  ngOnInit(): void {
    this.loadWarehouses();
    this.loadPositionTypes();
    this.loadRoles();
  }

  private async loadWarehouses() {
    try {
      const response: Warehouse[] = await this.rustService.call(
        async (bridge: GenericHttpBridge) => {
          return await bridge.get('/warehouse');
        }
      );
      this.logger.info(this.loadWarehouses.name, response);
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

  private async loadPositionTypes(): Promise<void> {
    try {
      const query = {
        page: 0,
        size: 100,
        sort: 'name,asc',
      };
      const queryString = this.objectToStringQuery(query);
      const response: PaginatedResponse<PositionType> = await this.rustService.call(
        async (bridge: GenericHttpBridge) => {
          return await bridge.get('/position-type?' + queryString);
        }
      );
      this.logger.info(this.loadPositionTypes.name, response);
      const mapping: SelectOption[] = response.content.map((item) => {
        return {
          value: item.id.toString(),
          label: item.name,
        };
      });
      this.optionsPositionTypes = mapping;
    } catch (error) {
      this.provideError(error);
    }
  }

  private async loadRoles() {
    try {
      const query = {
        page: 0,
        size: 100,
        sort: 'name,asc',
      };
      const urlQuery = this.objectToStringQuery(query);
      const response: PaginatedResponse<Role> = await this.rustService.call(
        async (bridge: GenericHttpBridge) => {
          return await bridge.get(`/role?${urlQuery}`);
        }
      );
      this.logger.info(this.loadRoles.name, response);
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

  public async register(form: NgForm) {
    this.formSubmitted.set(true);
    if (form.invalid) {
      this.toast.show('Por favor, completa todos los campos requeridos.', 'error');
      return;
    }

    if (!this.user?.employee?.warehouseId) {
      this.toast.show('Por favor, selecciona un almacen.', 'error');
      return;
    }

    if (!this.user?.employee?.positionId) {
      this.toast.show('Por favor, selecciona una posición.', 'error');
      return;
    }
    this.loading.set(true);
    this.user.user.roles = this.userRoles();
    try {
      const payload = {
        username: this.user.profile.username,
        fullName: this.user.profile.fullName,
        birthDate: this.user.profile.birthDate,
        phone: this.user.profile.phone || '',
        address: this.user.profile.address || '',
        email: this.user.profile.email || '',
        positionTypeId: this.user.employee?.positionId ?? 0,
        warehouseId: this.user.employee?.warehouseId ?? 0,
        roles: this.userRoles(),
        password: this.user.profile.passwordInit,
      };
      await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return bridge.post('/user', payload);
      });
      this.toast.show('Usuario agregado correctamente');
      this.router.navigate(['/app/users']);
    } catch (error) {
      this.provideError(error);
    } finally {
      this.loading.set(false);
    }
  }

  selectWarehouse(option: SelectOption) {
    this.user.employee!.warehouseId = Number(option.value); // Guardas el valor
  }

  selectPositionType(option: SelectOption) {
    this.user.employee!.positionId = Number(option.value); // Guardas el valor
  }
}
