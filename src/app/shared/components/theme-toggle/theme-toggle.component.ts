import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="themeService.toggleTheme()"
      class="p-2 rounded-xl bg-bg-secondary border border-border hover:bg-bg-primary transition-all flex items-center justify-center group shadow-sm hover:scale-105 active:scale-95"
      [title]="themeService.isDarkMode() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    >
      <!-- Sun Icon (Light Mode) -->
      @if (themeService.isDarkMode()) {
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-500 transition-transform group-hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.364l-.707.707M6.364 6.364l.707-.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      } @else {
        <!-- Moon Icon (Dark Mode) -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary transition-transform group-hover:-rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      }
    </button>
  `
})
export class ThemeToggleComponent {
  public themeService = inject(ThemeService);
}
