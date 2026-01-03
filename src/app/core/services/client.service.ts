import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import {
  Client,
  ClientResponse,
  ClientResponseFindOne,
} from '../../shared/models/client/client.interface';
import { AddClient } from '../../shared/models/client/add-client.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private api = inject(HttpService);
  private pathApi = 'client';

  // Solo pasas el endpoint y el tipo de dato
  public getClients(terms?: Record<string, string | number>) {
    return this.api.doGet<ClientResponse>(`${this.pathApi}`, terms);
  }

  public createClient(client: AddClient) {
    return this.api.doPost<AddClient>(`${this.pathApi}`, client);
  }

  public getById(id: number) {
    return this.api.doGet<ClientResponseFindOne>(`${this.pathApi}/${id}`);
  }

  public createUser(id: number) {
    return this.api.doGet<ClientResponseFindOne>(`${this.pathApi}/${id}/user`);
  }

  public updateClient(id: number, client: Client) {
    return this.api.doPatch<Client>(`${this.pathApi}/${id}`, client);
  }

  public deleteClient(id: number) {
    return this.api.doPatch<void>(`${this.pathApi}/${id}/delete`, null);
  }
}
