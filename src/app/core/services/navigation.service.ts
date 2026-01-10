import { inject, Injectable, signal } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private router = inject(Router);
  private location = inject(Location);

  // Signal para manejar el historial de forma reactiva
  public history = signal<string[]>([]);

  /**
   * Navega a una ruta y la agrega al historial (Push)
   */
  async push(path: string, params?: any) {
    console.log('Navigating to:', path, 'with params:', params);
    this.history.update((h) => [...h, path]);
    await this.router.navigate([path], { state: params });
  }

  /**
   * Limpia el historial y establece una nueva raíz (SetRoot)
   */
  async setRoot(path: string, params?: any) {
    this.history.set([path]);
    await this.router.navigate([path], {
      replaceUrl: true,
      state: params,
    });
  }

  /**
   * Vuelve a la página anterior (Pop)
   */
  pop() {
    if (this.history().length > 1) {
      this.history.update((h) => {
        const newHistory = [...h];
        newHistory.pop();
        return newHistory;
      });
      this.location.back();
    } else {
      this.setRoot(this.history()[0] || '/');
    }
  }

  /**
   * Obtiene los parámetros enviados por el 'state'
   */
  getParams<T>(): T | null {
    return this.router.getCurrentNavigation()?.extras.state as T;
  }
}
