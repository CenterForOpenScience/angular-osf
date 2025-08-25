import { EMPTY } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { DataciteEvent } from 'src/app/shared/models/datacite';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataciteService {
  #http: HttpClient = inject(HttpClient);

  logActivity(event: DataciteEvent, doi: string | null | undefined) {
    console.log(`Invoked ${event} with ${doi}`);
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
    return this.#http.post(`http://localhost:8000/api/metric`, payload, { headers });
  }
}
