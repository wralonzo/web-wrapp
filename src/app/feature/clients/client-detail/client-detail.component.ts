import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientService } from '@core/services/client.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Client } from '@shared/models/client/client.interface';
import { Reservation } from '@shared/models/reservation/reservation.interface';
import { ToastService } from '../../../core/services/toast.service';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { PageConfiguration } from 'src/app/page-configurations';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './client-detail.component.html',
})
export class ClientDetailComponent extends PageConfiguration implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientService = inject(ClientService);
  private toastService = inject(ToastService);

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
    if (!data || !data.phone) return null;
    const cleanPhone = data.phone.replace(/\D/g, '');
    const message = `Hola ${data.name}, te contactamos de TOP FASHION SALON`;
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  });

  private loadClient(id: string): void {
    this.clientService.getById(Number(id)).subscribe({
      next: (res) => {
        this.logger.info('Cliente:: ', res);
        this.client.set(res.data as Client);
      },
      error: () => this.nav.setRoot(`${APP_ROUTES.nav.clients}`),
    });
    this.loadReservations('');
  }

  private loadReservations(clientId: string) {
    // Aquí llamarías a tu servicio: this.reservationService.getByClientId(clientId)...
    // Simulamos datos:
    this.reservations.set([
      {
        id: 101,
        date: '2025-01-15',
        time: '10:00 AM',
        status: 'CONFIRMED',
        service: 'Asesoría Premium',
        total: 50.0,
      },
      {
        id: 102,
        date: '2025-02-10',
        time: '02:30 PM',
        status: 'PENDING',
        service: 'Mantenimiento General',
        total: 120.0,
      },
    ]);
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

  createUser() {
    this.clientService.createUser(Number(this.client()?.id)).subscribe({
      next: (res) => {
        this.logger.info('Cliente:: ', res);
        this.toastService.show('Usuario Creado', 'success');
        this.client.set(res.data as Client);
      },
    });
  }
}
