import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '@core/services/client.service';
import { ToastService } from '@core/services/toast.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { InputComponent } from '@shared/components/input/input.component';
import { CustomSelectComponent } from '@shared/components/select/select.component';
import { ClientTypes } from '@shared/enums/clients/Client-type.enum';
import { AddClient } from '@shared/models/client/add-client.interface';
import { SelectOption } from '@shared/models/select/option.interface';

@Component({
  selector: 'app-add-client',
  imports: [
    CommonModule,
    ButtonComponent,
    CustomSelectComponent,
    FormsModule,
    InputComponent,
    CheckboxComponent,
  ],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss',
  standalone: true,
})
export class AddClientComponent {
  private clientService = inject(ClientService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  public loading = signal(false);
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

  public register(form: NgForm) {
    if (form.invalid) {
      this.toastService.show('Por favor, completa todos los campos requeridos.', 'error');
      return;
    }
    if (!this.client.clientType) {
      this.toastService.show('Por favor, selecciona un tipo de cliente.', 'error');
      return;
    }

    this.loading.set(true);
    this.clientService.createClient(this.client).subscribe({
      next: (res) => {
        console.log('¡Éxito!', res);
        this.loading.set(false);
        this.toastService.show('Cliente creado exitosamente', 'success');

        this.router.navigate(['/app/clients']);
      },
      error: (err) => {
        this.loading.set(false);
      },
    });
  }

  selectTypeClient(option: SelectOption) {
    console.log('El valor seleccionado es:', option.value);
    this.client.clientType = option.value.toString() as ClientTypes; // Guardas el valor
  }
}
