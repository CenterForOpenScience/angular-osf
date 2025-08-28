import { EMPTY, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/constants/environment.token';
import { DataciteEvent } from '@shared/models/datacite/datacite-event.enum';

@Injectable({
  providedIn: 'root',
})
export class DataciteService {
  #http: HttpClient = inject(HttpClient);
  #environment = inject(ENVIRONMENT);

  logView(doi: string): Observable<void> {
    return this.logActivity(DataciteEvent.VIEW, doi);
  }

  logDownload(doi: string): Observable<void> {
    return this.logActivity(DataciteEvent.DOWNLOAD, doi);
  }

  private logActivity(event: DataciteEvent, doi: string): Observable<void> {
    if (!doi || !this.#environment.dataciteTrackerRepoId) {
      return EMPTY;
    }
    const payload = {
      n: event,
      u: window.location.href,
      i: this.#environment.dataciteTrackerRepoId,
      p: doi,
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    return this.#http.post<void>(this.#environment.dataciteTrackerAddress, payload, { headers });
  }
}
