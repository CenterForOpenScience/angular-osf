import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { DataciteEvent } from '@shared/models/datacite/datacite-event.enum';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataciteService {
  #http: HttpClient = inject(HttpClient);

  logView(doi: string): void {
    this.logActivity(DataciteEvent.VIEW, doi);
  }

  logDownload(doi: string): void {
    this.logActivity(DataciteEvent.DOWNLOAD, doi);
  }

  private logActivity(event: DataciteEvent, doi: string): void {
    console.log(`Logging ${event} for doi:${doi} to datacite tracker`);
    if (!doi || !environment.dataciteTrackerRepoId) {
      return;
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
    this.#http.post(`http://localhost:8000/api/metric`, payload, { headers }).subscribe();
  }
}
