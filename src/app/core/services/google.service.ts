import { inject } from '@angular/core';
import { HttpService } from './http.service';
import { HttpResponseApiFindOne } from '@shared/models/http/http-response';
import { map } from 'rxjs';

export class GoogleService {
  private api = inject(HttpService);
  private pathApi = 'config';

  getIdGoogleClient() {
    return this.api
      .doGet<HttpResponseApiFindOne<{ clientId: string }>>(`${this.pathApi}/google-client-id`)
      .pipe(
        map((response) => {
          const normalizedData = Array.isArray(response.data) ? response.data[0] : response.data;
          return { ...response, data: { clientId: normalizedData } };
        })
      );
  }
}
