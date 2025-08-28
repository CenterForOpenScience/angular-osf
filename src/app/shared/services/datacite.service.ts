import { EMPTY, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { DataciteEvent } from '@shared/models/datacite/datacite-event.enum';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataciteService {
  #http: HttpClient = inject(HttpClient);

  logView(doi: string): Observable<void> {
    return this.logActivity(DataciteEvent.VIEW, doi);
  }

  logDownload(doi: string): Observable<void> {
    return this.logActivity(DataciteEvent.DOWNLOAD, doi);
  }

  private logActivity(event: DataciteEvent, doi: string): Observable<void> {
    if (!doi || !environment.dataciteTrackerRepoId) {
      return EMPTY;
    }
    const payload = {
      n: event,
      u: window.location.href,
      i: environment.dataciteTrackerRepoId,
      p: doi,
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    return this.#http.post<void>(environment.dataciteTrackerAddress, payload, { headers });
  }
}
