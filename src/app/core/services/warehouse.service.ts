import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { WarehouseResponseFindOne } from '../../shared/models/warehouse/warehouse.interface';

@Injectable({ providedIn: 'root' })
export class WarehouseService {
  private api = inject(HttpService);
  private pathApi = 'warehouse';

  public find(params?: Record<string, string>) {
    return this.api.doGet<WarehouseResponseFindOne>(`${this.pathApi}`, params);
  }
}
