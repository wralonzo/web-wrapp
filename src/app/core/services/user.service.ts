import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AuthResponse, AuthResponseAll } from '@shared/models/user/user.model';
import { UserAdd } from '@shared/models/user/add-user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(HttpService);
  private pathApi = 'user';

  public get(params?: Record<string, string | number>) {
    return this.api.doGet<AuthResponseAll>(`${this.pathApi}`, params);
  }

  public create(client: UserAdd) {
    return this.api.doPost<UserAdd>(`${this.pathApi}`, client);
  }

  public getById(id: number) {
    return this.api.doGet<AuthResponse>(`${this.pathApi}/${id}/profile`);
  }

  public update(id: number, client: UserAdd) {
    return this.api.doPatch<UserAdd>(`${this.pathApi}/${id}`, client);
  }

  public delete(id: number) {
    return this.api.doPatch<void>(`${this.pathApi}/${id}/delete`, null);
  }

  public activate(id: number) {
    return this.api.doPatch<void>(`${this.pathApi}/${id}/activate`, null);
  }

  public deActivate(id: number) {
    return this.api.doPatch<void>(`${this.pathApi}/${id}/deactivate`, null);
  }

  public changePassword(id: number, newPassword: string, motive: string) {
    return this.api.doPatch<UserAdd>(`${this.pathApi}/${id}/password`, { newPassword, motive });
  }
}
