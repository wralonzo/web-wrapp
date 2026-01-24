import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '@core/services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loaderService.isLoading()) {
    <div
      class="fixed inset-0 z-[99999] flex items-center justify-center bg-text-primary/20 backdrop-blur-[2px] cursor-wait"
    >
      <div
        class="p-5 bg-bg-primary rounded-[32px] shadow-2xl border border-border flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-200"
      >
        <div class="relative h-12 w-12">
          <div class="absolute inset-0 rounded-full border-4 border-bg-secondary"></div>
          <div
            class="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
          ></div>
        </div>
        <span class="text-sm font-bold text-text-primary tracking-wide">Procesando...</span>
      </div>
    </div>
    }
  `,
})
export class LoaderComponent {
  public loaderService = inject(LoaderService);
}
