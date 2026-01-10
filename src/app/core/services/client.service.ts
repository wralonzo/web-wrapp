import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Client, ClientResponseFindOne } from '../../shared/models/client/client.interface';
import { AddClient } from '../../shared/models/client/add-client.interface';
import { RustService } from '@core/rust/rust.service';
import { ClientBridge } from '@assets/retail-shop/rust_retail';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';
import { ClientResponse } from '@assets/retail-shop/ClientResponse';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private api = inject(HttpService);
  private readonly rustBridge = inject(RustService);
  private pathApi = 'client';
  private clientBridge: ClientBridge;
  constructor() {
    this.clientBridge = new ClientBridge();
  }

  // Solo pasas el endpoint y el tipo de dato
  public async getClients(search: string, sort: string, page: number, size: number, type: string) {
    try {
      const data = await  this.clientBridge.getClients(search, sort, page, size, type);
      console.log(this.getClients.name, data)
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
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
