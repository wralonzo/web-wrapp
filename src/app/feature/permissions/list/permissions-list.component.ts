import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-permissions-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 transition-colors duration-300">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
           <h1 class="text-3xl font-black text-text-primary tracking-tight uppercase">Permisos</h1>
           <p class="text-text-muted font-bold text-sm mt-1">Definición de privilegios y políticas de acceso.</p>
        </div>
      </div>
      <div class="bg-bg-secondary rounded-[2.5rem] border border-border p-16 text-center shadow-inner">
        <div class="w-16 h-16 bg-bg-primary rounded-2xl flex items-center justify-center border border-border mx-auto mb-6 text-text-muted/30">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        </div>
        <p class="text-text-muted font-black uppercase tracking-widest text-xs">Políticas de privilegios inalterables por el sistema</p>
      </div>
    </div>
  `,
})
export class PermissionsListComponent { }
