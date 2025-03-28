import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {
  ApiData, JsonApiArrayResponse,
  JsonApiResponse,
} from '@core/services/json-api/json-api.entity';

@Injectable({
  providedIn: 'root',
})
export class JsonApiService {
  http: HttpClient = inject(HttpClient);

  // get<T>(url: string): Observable<T> {
  //  return this.http
  //     .get<T>(url)
  //     .pipe(map((response) => (response.data as ApiData<T>).attributes));
  // }

  getArray<T>(url: string, params?: Record<string, any>): Observable<T[]> {
    let httpParams = new HttpParams();

    if (params) {
      for (const key in params) {
        const value = params[key];

        if (Array.isArray(value)) {
          value.forEach((item) => {
            httpParams = httpParams.append(`${key}[]`, item); // Handles arrays
          });
        } else {
          httpParams = httpParams.set(key, value);
        }
      }
    }

    return this.http
      .get<JsonApiArrayResponse<T>>(url)
      .pipe(map(response => response.data as T[]));
  }
}
