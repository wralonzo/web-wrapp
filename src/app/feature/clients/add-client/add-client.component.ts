import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { InputComponent } from '@shared/components/input/input.component';
import { CustomSelectComponent } from '@shared/components/select/select.component';
import { ClientTypes } from '@shared/enums/clients/Client-type.enum';
import { AddClient } from '@shared/models/client/add-client.interface';
import { SelectOption } from '@shared/models/select/option.interface';
import { PageConfiguration } from 'src/app/page-configurations';

@Component({
  selector: 'app-add-client',
  imports: [
    CommonModule,
    ButtonComponent,
    CustomSelectComponent,
    FormsModule,
    InputComponent,
    CheckboxComponent,
    RouterLink,
  ],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss',
})
export class AddClientComponent extends PageConfiguration {
  public loading = signal(false);
  public formSubmitted = signal(false);

  public client: AddClient = {
    name: '',
    email: '',
    address: '',
    phone: '',
    flagUser: false,
    clientType: ClientTypes.REGULAR,
  };

  public optionsTypeClient: SelectOption[] = [
    { value: ClientTypes.REGULAR, label: 'Regular' },
    { value: ClientTypes.VIP, label: 'VIP' },
    { value: ClientTypes.WHOLESALER, label: 'MAYORISTA' },
    { value: ClientTypes.PREMIUM, label: 'PREMIUM' },
  ];

  public async register(form: NgForm) {
    this.formSubmitted.set(true);

    if (form.invalid) {
      this.toast.show('Por favor, completa todos los campos requeridos.', 'error');
      return;
    }
    if (!this.client.clientType) {
      this.toast.show('Por favor, selecciona un tipo de cliente.', 'error');
      return;
    }

    this.loading.set(true);
    try {
      const response = await this.rustService.call(async (bridge) => {
        return await bridge.post('/client', this.client);
      });
      this.logger.info(this.register.name, response);
      this.nav.setRoot(`${APP_ROUTES.nav.clients}`);
      this.toast.show('Cliente creado exitosamente', 'success');
    } catch (error: any) {
      this.logger.error(this.register.name, error);
      this.toast.show(error?.payload?.message ?? 'El servidor no response', 'error');
    } finally {
      this.loading.set(false);
    }
  }

  selectTypeClient(option: SelectOption) {
    this.client.clientType = option.value.toString() as ClientTypes;
  }
}
