export interface AddReservation {
  clientId: number;
  warehouseId: number;
  reservationDate: Date;
  startTime: string;
  finishDate: string;
  type: string;
  notes: string;
  employee: number;
}
