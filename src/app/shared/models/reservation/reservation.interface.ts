export interface Reservation {
  id: number;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  service: string; // Ejemplo: "Corte de Cabello", "Mesa 4", etc.
  total: number;
}
