import { inject } from '@angular/core';
import { ProductService } from '../product.service';
import { HttpResponse } from '@angular/common/http';

export class DownloadExcelTemplateService {
  private readonly productService = inject(ProductService);

  public getFile() {
    return this.productService.downloadTemplateExcel().subscribe({
      next: (response: HttpResponse<Blob>) => {
        // SI ESTO IMPRIME ALGO QUE EMPIEZA CON "<!DOCTYPE html>",
        // la URL del backend está mal o no tienes permisos.
        console.log('Tipo de contenido recibido:', response.type);
        const contentType = response.headers.get('content-type');

        // VALIDACIÓN CRÍTICA: Si llega un HTML, algo está mal en la ruta
        if (contentType?.includes('text/html')) {
          console.error('Error: Se recibió HTML en lugar de Excel. Revisa el Proxy o la URL.');
          return;
        }

        const body = response.body;
        const contentDisposition = response.headers.get('content-disposition');
        let fileName = 'plantilla-products.xlsx';

        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          if (matches?.[1]) fileName = matches[1].replaceAll(/['"]/g, '');
        }

        if (body) {
          const url = globalThis.URL.createObjectURL(body);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.click();
          globalThis.URL.revokeObjectURL(url);
        }
      },
    });
  }
}
