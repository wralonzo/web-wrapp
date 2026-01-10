import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private http = inject(HttpClient);
  private logger = inject(LoggerService);
  private baseUrl = environment.apiUrl+"/";

  // Método GENÉRICO para GET
  doGet<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>
  ): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${endpoint}`, {
        params: params,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  // Método GENÉRICO para POST
  doPost<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body).pipe(
      map((response) => response),
      catchError((error) => this.handleError(error))
    );
  }

  // Método GENÉRICO para PUT
  doPut<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body).pipe(
      map((response) => response),
      catchError((error) => this.handleError(error))
    );
  }

  doPatch<T>(endpoint: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body).pipe(
      map((response) => response),
      catchError((error) => this.handleError(error))
    );
  }

  // Método GENÉRICO para DELETE
  doDelete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`).pipe(
      map((response) => response),
      catchError((error) => this.handleError(error))
    );
  }

  // Dentro de tu clase ApiService (o similar)
  public doGetFile(endpoint: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.baseUrl}${endpoint}`, {
      responseType: 'blob', // <--- Esto es vital para archivos
      observe: 'response',
    });
  }

  // Manejo de errores centralizado
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor (404, 500, etc)
      if (error.status === 400) {
        const dataError: any = error.error;
        errorMessage = dataError.data.message || 'Solicitud incorrecta';
      } else {
        errorMessage = `Código: ${error.status}, Mensaje: ${error.message}`;
      }
    }
    this.logger.error('HTTP Error:', error);
    return throwError(() => new Error(errorMessage, { cause: error }));
  }
}
