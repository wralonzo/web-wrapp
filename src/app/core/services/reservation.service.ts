import { inject } from '@angular/core';
import { HttpService } from './http.service';
import {
  ReservationsResponse,
  Reservation,
  ReservationResponse,
} from '@shared/models/reservation/reservation.interface';

export class ReservationService {
  private readonly api = inject(HttpService);
  private readonly controller: string = 'reservations';

  public find(params?: Record<string, string | number>) {
    return this.api.doGet<ReservationsResponse>(`${this.controller}`, params);
  }

  public findById(id: number) {
    return this.api.doGet<ReservationResponse>(`${this.controller}/${id}`);
  }

  public create(product: Reservation) {
    return this.api.doPost<ReservationResponse>(`${this.controller}`, product);
  }

  public update(id: number, product: Reservation) {
    return this.api.doPatch<ReservationResponse>(`${this.controller}/${id}`, product);
  }

  public delete(id: number) {
    return this.api.doDelete<void>(`${this.controller}/${id}`);
  }

  public deactive(id: number) {
    return this.api.doGet<ReservationResponse>(`${this.controller}/deactive/${id}`);
  }
}
