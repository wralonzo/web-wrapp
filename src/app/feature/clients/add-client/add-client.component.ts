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
      const payload = {
        auth: {
          fullName: this.client.name,
          email: this.client.email,
          phone: this.client.phone,
          address: this.client.address,
          birthDate: this.client.birthDate,
          password: this.client.password ?? "Test123456",
          username: this.client.email,
        },
        client: {
          clientType: this.client.clientType,
          taxId: this.client.taxId,
          preferredDeliveryAddress: this.client.preferredDeliveryAddress,
        },
        flagUser: this.client.flagUser,
      };
      const response = await this.rustService.call(async (bridge) => {
        return await bridge.post('/client', payload);
      });
      this.logger.info(this.register.name, response);
      this.nav.setRoot(`${APP_ROUTES.nav.clients.list}`);
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

  generatePassword() {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$&*()_+-=?';
    const all = 'abcdefghijklmnopqrstuvwxyz' + upper + numbers + symbols;

    const getRandom = (str: string) => str[Math.floor(Math.random() * str.length)];

    let password = getRandom(upper) + getRandom(numbers) + getRandom(symbols);

    for (let i = 0; i < 7; i++) {
      password += getRandom(all);
    }
    this.client.password = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    this.toast.show('Contraseña generada exitosamente', 'success');
  }
}
