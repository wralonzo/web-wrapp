import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Señal que almacena el array de toasts
  private toastsSignal = signal<Toast[]>([]);
  public toasts = this.toastsSignal.asReadonly();

  show(message: string, type: ToastType = 'success', duration: number = 10000) {
    const id = Date.now();
    const newToast: Toast = { id, message, type };

    // Agregamos el toast al inicio del array
    this.toastsSignal.update((prev) => [newToast, ...prev]);

    // Auto-eliminar después del tiempo definido
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: number) {
    this.toastsSignal.update((prev) => prev.filter((t) => t.id !== id));
  }
}
