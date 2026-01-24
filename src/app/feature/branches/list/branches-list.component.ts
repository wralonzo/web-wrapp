import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-branches-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="p-8 transition-colors duration-300">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
           <h1 class="text-3xl font-black text-text-primary tracking-tight uppercase">Sucursales</h1>
           <p class="text-text-muted font-bold text-sm mt-1">Gestión de puntos de venta y atención al cliente.</p>
        </div>
        <app-button label="Abrir Punto de Venta" type="button" icon="add-plus"></app-button>
      </div>
      <div class="bg-bg-secondary rounded-[2.5rem] border border-border p-16 text-center shadow-inner">
        <div class="w-16 h-16 bg-bg-primary rounded-2xl flex items-center justify-center border border-border mx-auto mb-6 text-text-muted/30">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        </div>
        <p class="text-text-muted font-black uppercase tracking-widest text-xs">Sincronizando red de establecimientos</p>
      </div>
    </div>
  `,
})
export class BranchesListComponent { }
