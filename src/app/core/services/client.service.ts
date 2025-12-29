import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Client, ClientResponse } from '../../shared/models/client/client.interface';
import { AddClient } from '../../shared/models/client/add-client.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private api = inject(HttpService);
  private pathApi = 'client';

  // Solo pasas el endpoint y el tipo de dato
  public getClients() {
    return this.api.doGet<ClientResponse>(`${this.pathApi}`);
  }

  public createClient(client: AddClient) {
    return this.api.doPost<AddClient>(`${this.pathApi}`, client);
  }

  public getById(id: number) {
    return this.api.doGet<Client>(`${this.pathApi}/${id}`);
  }

  public updateClient(id: number, client: Client) {
    return this.api.doPatch<Client>(`${this.pathApi}/${id}`, client);
  }

  public deleteClient(id: number) {
    return this.api.doPatch<void>(`${this.pathApi}/${id}/delete`, null);
  }
}
