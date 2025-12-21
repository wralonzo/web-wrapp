import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Client, ClientResponse } from '../../shared/models/client/client.interface';
import { AddClient } from '../../shared/models/client/add-client.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private api = inject(HttpService);

  // Solo pasas el endpoint y el tipo de dato
  getClients() {
    return this.api.doGet<ClientResponse>('client');
  }

  createClient(client: AddClient) {
    return this.api.doPost<AddClient>('client', client);
  }
}
