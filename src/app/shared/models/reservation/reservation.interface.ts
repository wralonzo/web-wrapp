import { HttpResponseApi, HttpResponseApiFindOne } from '../http/http-response';

export interface Reservation {
  id?: number;
  date: string;
  time: string;
  service: string;
  total: number;
  clientName: string;
  employeeName: string;
  warehouseName: string;
  reservationDate?: Date;
  startTime?: Date;
  finishDate?: Date;
  type: string;
  state: string;
  notes: string;
}

export interface ReservationResponse extends HttpResponseApiFindOne<Reservation> {}
export interface ReservationsResponse extends HttpResponseApi<Reservation> {}
