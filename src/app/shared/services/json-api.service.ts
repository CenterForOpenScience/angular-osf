import { map, Observable } from 'rxjs';

import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@osf/shared/models';

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

  post<T>(url: string, body?: unknown, params?: Record<string, unknown>): Observable<T> {
    return this.http.post<T>(url, body, {
      params: this.buildHttpParams(params),
    });
  }

  patch<T>(
    url: string,
    body: unknown,
    params?: Record<string, unknown>,
    headers?: Record<string, string>
  ): Observable<T> {
    return this.http
      .patch<JsonApiResponse<T, null>>(url, body, { params: this.buildHttpParams(params), headers })
      .pipe(map((response) => response.data));
  }

  put<T>(url: string, body: unknown, params?: Record<string, unknown>): Observable<T> {
    return this.http
      .put<JsonApiResponse<T, null>>(url, body, { params: this.buildHttpParams(params) })
      .pipe(map((response) => response.data));
  }

  putFile<T>(
    url: string,
    file: File,
    params?: Record<string, string>
  ): Observable<HttpEvent<JsonApiResponse<T, null>>> {
    return this.http.put<JsonApiResponse<T, null>>(url, file, {
      params: params,
      reportProgress: true,
      observe: 'events',
      responseType: 'json' as const,
    });
  }

  delete(url: string, body?: unknown, headers?: Record<string, string>): Observable<void> {
    return this.http.delete<void>(url, { body, headers });
  }
}
