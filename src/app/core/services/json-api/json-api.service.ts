import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class JsonApiService {
  http: HttpClient = inject(HttpClient);

  get<T>(url: string, params?: Record<string, unknown>): Observable<T> {
    const token =
      'UlO9O9GNKgVzJD7pUeY53jiQTKJ4U2znXVWNvh0KZQruoENuILx0IIYf9LoDz7Duq72EIm';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.api+json',
    });

    return this.http.get<T>(url, {
      params: this.buildHttpParams(params),
      headers: headers,
    });
  }

  private buildHttpParams(params?: Record<string, unknown>): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      for (const key in params) {
        const value = params[key];

        if (Array.isArray(value)) {
          value.forEach((item) => {
            httpParams = httpParams.append(`${key}`, item); // Handles arrays
          });
        } else {
          httpParams = httpParams.set(key, value as string);
        }
      }
    }

    return httpParams;
  }
}
