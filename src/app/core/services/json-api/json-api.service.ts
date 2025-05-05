import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { JsonApiResponse } from '@core/services/json-api/json-api.entity';

@Injectable({
  providedIn: 'root',
})
export class JsonApiService {
  http: HttpClient = inject(HttpClient);
  readonly #token =
    'Bearer 2rjFZwmdDG4rtKj7hGkEMO6XyHBM2lN7XBbsA1e8OqcFhOWu6Z7fQZiheu9RXtzSeVrgOt';
  readonly #headers = new HttpHeaders({
    Authorization: this.#token,
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  });

  get<T>(url: string, params?: Record<string, unknown>): Observable<T> {
    return this.http.get<T>(url, {
      params: this.buildHttpParams(params),
      headers: this.#headers,
    });
  }

  private buildHttpParams(params?: Record<string, unknown>): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      for (const key in params) {
        const value = params[key];

        if (Array.isArray(value)) {
          value.forEach((item) => {
            httpParams = httpParams.append(`${key}`, item);
          });
        } else {
          httpParams = httpParams.set(key, value as string);
        }
      }
    }

    return httpParams;
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http
      .post<JsonApiResponse<T, null>>(url, body, { headers: this.#headers })
      .pipe(map((response) => response.data));
  }

  patch<T>(url: string, body: unknown): Observable<T> {
    return this.http
      .patch<JsonApiResponse<T, null>>(url, body, { headers: this.#headers })
      .pipe(map((response) => response.data));
  }

  delete(url: string): Observable<void> {
    return this.http.delete<void>(url, { headers: this.#headers });
  }
}
