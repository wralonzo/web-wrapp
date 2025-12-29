import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '@core/services/client.service';
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
  public loading = signal(false);
  public errorMessage = signal(false);
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

  public register() {
    this.loading.set(true);
    this.clientService.createClient(this.client).subscribe({
      next: (res) => {
        console.log('¡Éxito!', res);
        this.loading.set(false);
        this.router.navigate(['/app/clients']);
      },
      error: (err) => {
        // Aquí 'err' es el objeto que armamos en el paso 1
        console.error('Error capturado en el componente:', err.message);
        this.errorMessage.set(err.message);
        this.loading.set(false);
      },
    });
  }

  selectTypeClient(option: SelectOption) {
    console.log('El valor seleccionado es:', option.value);
    this.client.clientType = option.value.toString() as ClientTypes; // Guardas el valor
  }
}
