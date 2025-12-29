import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomModalComponent } from './custom-modal.component';
import { ConfirmService } from '@core/services/confirm.service';

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports: [CommonModule, CustomModalComponent],
  template: `
    @if (confirmService.modalState(); as state) {
    <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        (click)="confirmService.close(false)"
      ></div>

      <div
        class="relative bg-white w-full max-w-[440px] rounded-[32px] shadow-2xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <button
          (click)="confirmService.close(false)"
          class="absolute top-5 right-5 z-50 p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <app-custom-modal
          [title]="state.options.title"
          [message]="state.options.message || ''"
          [btnConfirmText]="state.options.btnConfirmText || 'Confirmar'"
          [btnCancelText]="state.options.btnCancelText || 'Cancelar'"
          [variant]="state.options.variant || 'primary'"
        ></app-custom-modal>
      </div>
    </div>
    }
  `,
})
export class ModalHostComponent {
  confirmService = inject(ConfirmService);
}
