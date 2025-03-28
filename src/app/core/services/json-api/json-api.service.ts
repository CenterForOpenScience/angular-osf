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

  get<T>(url: string, params?: Record<string, unknown>): Observable<T> {
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

    return this.http
      .get<JsonApiResponse<T>>(url)
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
      Authorization: `Bearer UlO9O9GNKgVzJD7pUeY53jiQTKJ4U2znXVWNvh0KZQruoENuILx0IIYf9LoDz7Duq72EIm`,
    });

    return this.http
      .get<
        JsonApiArrayResponse<T>
      >(url, { params: httpParams, headers: headers })
      .pipe(map((response) => response.data));
  }
}
