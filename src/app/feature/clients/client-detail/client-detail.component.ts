import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Client } from '@shared/models/client/client.interface';
import { Reservation } from '@shared/models/reservation/reservation.interface';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { PageConfiguration } from 'src/app/page-configurations';
import { GenericHttpBridge } from '@assets/retail-shop/rust_retail';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './client-detail.component.html',
})
export class ClientDetailComponent extends PageConfiguration implements OnInit {
  private route = inject(ActivatedRoute);

  public client = signal<Client | null>(null);
  public reservations = signal<Reservation[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClient(id);
    }
  }
  public whatsappUrl = computed(() => {
    const data = this.client();
    if (!data || !data.profile.phone) return null;
    const cleanPhone = data.profile.phone.replace(/\D/g, '');
    const message = `Hola ${data.profile.fullName}, te contactamos de TOP FASHION SALON`;
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  });

  private async loadClient(id: string) {
    try {
      const response: Client = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return await bridge.get(`/client/${id}`);
      });
      this.logger.info('Cliente:: ', response);
      this.client.set(response);
      this.loadReservations('');
    } catch (error) {
      this.provideError(error);
    }

    this.loadReservations('');
  }

  private loadReservations(clientId: string) {
    // Aquí llamarías a tu servicio: this.reservationService.getByClientId(clientId)...
    // Simulamos datos:
    this.reservations.set([]);
  }

  getStatusClass(status: string) {
    const classes: Record<string, string> = {
      CONFIRMED: 'bg-green-50 text-green-700 border-green-100',
      PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
      CANCELLED: 'bg-red-50 text-red-700 border-red-100',
      COMPLETED: 'bg-blue-50 text-blue-700 border-blue-100',
    };
    return classes[status] || 'bg-zinc-50 text-zinc-700';
  }

  goBack() {
    this.nav.pop();
  }

  goToEdit() {
    const client = this.client();
    if (client) {
      this.nav.push(APP_ROUTES.nav.clients.edit(client.id ?? ''));
    }
  }

  async createUser() {
    try {
      const response: Client = await this.rustService.call(async (bridge: GenericHttpBridge) => {
        return bridge.get(`/client/${this.client()?.id}/user`);
      });
      this.logger.info('Cliente:: ', response);
      this.toast.show('Usuario Creado', 'success');
      this.client.set(response);
    } catch (error) {
      this.provideError(error);
    }
  }
}
