import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../shared/models/client/client.interface';
import { CustomSelectComponent } from '../../shared/components/select/select.component';
import { SelectOption } from '../../shared/models/select/option.interface';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { ClientService } from '../../core/services/client.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomSelectComponent, ButtonComponent],
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit {
  // Datos de prueba (esto vendría de tu ClientsService)
  private clientService = inject(ClientService);
  private router = inject(Router);
  public clients = signal<Client[]>([]);

  ngOnInit(): void {
    this.loadClients();
  }
  public searchQuery = signal('');

  public options: SelectOption[] = [
    { value: 1, label: 'Ana García' },
    { value: 2, label: 'Roberto Carlos' },
    { value: 3, label: 'Elena Martínez' },
  ];
  // Filtro reactivo: Se ejecuta cada vez que searchQuery o clients cambian
  public filteredClients = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.clients().filter(
      (c) => c.name.toLowerCase().includes(query) || c.phone.includes(query)
    );
  });

  public addClient(): void {
    this.router.navigate(['/app/clients/add']);
    console.log('Agregar nuevo cliente');
  }

  public loadClients() {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients.set(clients.data as Client[]);
      },
      error: (err) => {
        this.clients.set([]);
        console.error('Error al cargar los clientes:', err);
      },
    });
  }
}
