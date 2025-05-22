import { map, Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@core/services/json-api/json-api.entity';

@Injectable({
  providedIn: 'root',
})
export class JsonApiService {
  http: HttpClient = inject(HttpClient);

  get<T>(url: string, params?: Record<string, unknown>): Observable<T> {
    return this.http.get<T>(url, {
      params: this.buildHttpParams(params),
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

  post<T>(url: string, body: unknown, params?: Record<string, unknown>): Observable<T> {
    return this.http
      .post<JsonApiResponse<T, null>>(url, body, {
        params: this.buildHttpParams(params),
      })
      .pipe(map((response) => response.data));
  }

  patch<T>(url: string, body: unknown): Observable<T> {
    return this.http.patch<JsonApiResponse<T, null>>(url, body).pipe(map((response) => response.data));
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<JsonApiResponse<T, null>>(url, body).pipe(map((response) => response.data));
  }

  delete(url: string, body?: unknown): Observable<void> {
    return this.http.delete<void>(url, { body: body });
  }
}
