import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  JsonApiArrayResponse,
  JsonApiResponse,
} from '@core/services/json-api/json-api.entity';

@Injectable({
  providedIn: 'root',
})
export class JsonApiService {
  http: HttpClient = inject(HttpClient);

  get<T>(url: string): Observable<T> {
    const headers = new HttpHeaders({
      Authorization: `Bearer 2rjFZwmdDG4rtKj7hGkEMO6XyHBM2lN7XBbsA1e8OqcFhOWu6Z7fQZiheu9RXtzSeVrgOt`,
    });

    return this.http
      .get<JsonApiResponse<T>>(url, { headers })
      .pipe(map((response) => response.data));
  }

  getArray<T>(url: string, params?: Record<string, unknown>): Observable<T[]> {
    let httpParams = new HttpParams();

    if (params) {
      for (const key in params) {
        const value = params[key];

        if (Array.isArray(value)) {
          value.forEach((item) => {
            httpParams = httpParams.append(`${key}[]`, item); // Handles arrays
          });
        } else {
          httpParams = httpParams.set(key, value as string);
        }
      }
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer 2rjFZwmdDG4rtKj7hGkEMO6XyHBM2lN7XBbsA1e8OqcFhOWu6Z7fQZiheu9RXtzSeVrgOt`,
    });

    return this.http
      .get<
        JsonApiArrayResponse<T>
      >(url, { params: httpParams, headers: headers })
      .pipe(map((response) => response.data));
  }

  post<T>(url: string, body: unknown): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer 2rjFZwmdDG4rtKj7hGkEMO6XyHBM2lN7XBbsA1e8OqcFhOWu6Z7fQZiheu9RXtzSeVrgOt`,
    });

    return this.http
      .post<JsonApiResponse<T>>(url, body, { headers })
      .pipe(map((response) => response.data));
  }

  patch<T>(url: string, body: unknown): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer 2rjFZwmdDG4rtKj7hGkEMO6XyHBM2lN7XBbsA1e8OqcFhOWu6Z7fQZiheu9RXtzSeVrgOt`,
    });

    return this.http
      .patch<JsonApiResponse<T>>(url, body, { headers })
      .pipe(map((response) => response.data));
  }

  delete(url: string): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer 2rjFZwmdDG4rtKj7hGkEMO6XyHBM2lN7XBbsA1e8OqcFhOWu6Z7fQZiheu9RXtzSeVrgOt`,
    });

    return this.http.delete<void>(url, { headers });
  }
}
