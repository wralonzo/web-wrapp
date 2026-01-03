import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { PostionTypeResponse } from '@shared/models/position-type/postion-type.interface';

@Injectable({ providedIn: 'root' })
export class PositionTypeService {
  private api = inject(HttpService);
  private pathApi = 'position-type';

  public find(params?: Record<string, string | number>) {
    return this.api.doGet<PostionTypeResponse>(`${this.pathApi}`, params);
  }
}
