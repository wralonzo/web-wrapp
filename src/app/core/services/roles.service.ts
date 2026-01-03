import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { RoleResponse } from '@shared/models/role/role.interface';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private api = inject(HttpService);
  private pathApi = 'role';

  public find(params?: Record<string, string | number>) {
    return this.api.doGet<RoleResponse>(`${this.pathApi}`, params);
  }
}
