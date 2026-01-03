import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  // Solo imprimimos si estamos en modo desarrollo
  private readonly isDev = isDevMode();

  // Estilos CSS para la consola
  private readonly styles = {
    info: 'color: #00b4d8; font-weight: bold; background: #caf0f8; padding: 2px 5px; border-radius: 3px;',
    success:
      'color: #2d6a4f; font-weight: bold; background: #d8f3dc; padding: 2px 5px; border-radius: 3px;',
    warning:
      'color: #fca311; font-weight: bold; background: #fff3b0; padding: 2px 5px; border-radius: 3px;',
    error:
      'color: #9b2226; font-weight: bold; background: #f8d7da; padding: 2px 5px; border-radius: 3px;',
  };

  log(message: string, ...data: any[]): void {
    if (this.isDev) {
      console.log(`%c[INFO] %c${message}`, this.styles.info, '', ...data);
    }
  }

  info(message: string, ...data: any[]): void {
    if (this.isDev) {
      console.log(`%c[SUCCESS] %c${message}`, this.styles.success, '',  ...data);
    }
  }

  warnign(message: string, ...data: any[]): void {
    if (this.isDev) {
      console.warn(`%c[WARNING] %c${message}`, this.styles.warning, '',  ...data);
    }
  }

  error(message: string, ...data: any[]): void {
    // Los errores se suelen mostrar incluso en producción para monitoreo remoto si fuera necesario
    console.error(`%c[ERROR] %c${message}`, this.styles.error, '',  ...data);
  }
}
