import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  ApiData,
  JsonApiResponse,
} from '@core/services/json-api/json-api.entity';

@Injectable({
  providedIn: 'root',
})
export class JsonApiService {
  http: HttpClient = inject(HttpClient);

  get<T>(url: string): Observable<T> {
    return this.http
      .get<JsonApiResponse<T>>(url)
      .pipe(map((response) => (response.data as ApiData<T>).attributes));
  }

  getArray<T>(url: string): Observable<T[]> {
    return this.http
      .get<JsonApiResponse<T>>(url)
      .pipe(
        map((response) =>
          (response.data as ApiData<T>[]).map((item) => item.attributes),
        ),
      );
  }
}
