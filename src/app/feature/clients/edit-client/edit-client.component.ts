import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '@core/services/client.service';
import { ToastService } from '@core/services/toast.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { CustomSelectComponent } from '@shared/components/select/select.component';
import { ClientTypes } from '@shared/enums/clients/Client-type.enum';
import { Client } from '@shared/models/client/client.interface';
import { SelectOption } from '@shared/models/select/option.interface';
import { finalize } from 'rxjs';

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
export class EditClientComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientService = inject(ClientService);
  private toast = inject(ToastService);

  // Estados
  loadingData = signal(false);
  submitting = signal(false);
  clientId = signal<number | null>(null);

  // Objeto del cliente (Estructura inicial)
  public client: Client = {
    name: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    clientType: ClientTypes.REGULAR,
    notes: '',
    id: 0,
    lastVisit: '',
    totalSpent: 0,
    status: 1,
    code: '',
  };

  optionsTypeClient = [
    { value: ClientTypes.REGULAR, label: 'Regular' },
    { value: ClientTypes.VIP, label: 'VIP' },
    { value: ClientTypes.WHOLESALER, label: 'MAYORISTA' },
    { value: ClientTypes.PREMIUM, label: 'PREMIUM' },
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientId.set(+id);
      this.loadClient();
    }
  }

  loadClient() {
    this.loadingData.set(true);
    this.clientService
      .getById(this.clientId()!)
      .pipe(finalize(() => this.loadingData.set(false)))
      .subscribe({
        next: (res: any) => {
          this.client = { ...res.data };
        },
        error: () => this.router.navigate(['/app/clients']),
      });
  }

  selectTypeClient(option: SelectOption) {
    console.log('Tipo de cliente seleccionado:', option);
    this.client.clientType = option.value.toString() as ClientTypes;
  }

  onSubmit() {
    this.submitting.set(true);
    this.clientService
      .updateClient(this.clientId()!, this.client)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/app/clients']);
          this.toast.show('¡Cliente actualizado correctamente!', 'success');
        },
        error: (err) => {
          console.error('Error al actualizar', err);
        },
      });
  }
}
