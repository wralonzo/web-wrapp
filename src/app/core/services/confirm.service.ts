import { Injectable, signal } from '@angular/core';

export interface ModalOptions {
  title: string;
  message?: string;
  btnConfirmText?: string;
  btnCancelText?: string;
  variant?: 'danger' | 'primary' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private state = signal<{ options: ModalOptions; resolve: (v: any) => void } | null>(null);
  public modalState = this.state.asReadonly();

  open(options: ModalOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.state.set({ options, resolve });
    });
  }

  close(result: boolean = false) {
    const current = this.state();
    if (current) {
      current.resolve(result);
      this.state.set(null);
    }
  }
}
