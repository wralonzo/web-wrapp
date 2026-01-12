import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { CustomSelectComponent } from '@shared/components/select/select.component';
import { ClientTypes } from '@shared/enums/clients/Client-type.enum';
import { Client } from '@shared/models/client/client.interface';
import { SelectOption } from '@shared/models/select/option.interface';
import { finalize } from 'rxjs';
import { PageConfiguration } from 'src/app/page-configurations';

@Component({
  selector: 'app-edit-client',
  imports: [
    CommonModule,
    ButtonComponent,
    CustomSelectComponent,
    FormsModule,
    InputComponent,
    RouterLink,
  ],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.scss',
})
export class EditClientComponent extends PageConfiguration implements OnInit {
  private route = inject(ActivatedRoute);

  // Estados
  loadingData = signal(false);
  submitting = signal(false);
  clientId = signal<number | null>(null);

  // Objeto del cliente (Estructura inicial)
  public client = signal<Client | null>(null);

  optionsTypeClient = [
    { value: ClientTypes.REGULAR, label: 'Regular' },
    { value: ClientTypes.VIP, label: 'VIP' },
    { value: ClientTypes.WHOLESALER, label: 'MAYORISTA' },
    { value: ClientTypes.PREMIUM, label: 'PREMIUM' },
  ];

  constructor() {
    super();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientId.set(+id);
      this.loadClient();
    }
  }

  async loadClient() {
    try {
      const response: Client = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return await bridge.get(`/client/${this.clientId()!}`);
      });
      this.logger.info('Cliente:: ', response);
      this.client.set(response);
    } catch (error) {
      this.provideError(error);
    }
  }

  selectTypeClient(option: SelectOption) {
    console.log('Tipo de cliente seleccionado:', option);
    this.client()!.clientType = option.value.toString() as ClientTypes;
  }

  async onSubmit() {
    try {
      this.submitting.set(true);
      await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return bridge.patch(`/client/${this.clientId()!}`, this.client);
      });
    } catch (error) {
      this.provideError(error);
    } finally {
      this.submitting.set(false);
    }
  }
}
