import { EMPTY, map, Observable } from 'rxjs';

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

  /**
   * Logs a "view" event for a given DOI to the Datacite tracker.
   * If the DOI is null/empty or the tracker repository ID is not configured,
   * (in most cases, due to being used in dev environment),
   * returns an empty observable.
   *
   * @param doi - The DOI (Digital Object Identifier) of the resource.
   * @returns An Observable that completes when the request is sent.
   */
  logView(doi: string): Observable<void> {
    return this.logActivity(DataciteEvent.VIEW, doi);
  }

  /**
   * Logs a "download" event for a given DOI to the Datacite tracker.
   * If the DOI is null/empty or the tracker repository ID is not configured
   * (in most cases, due to being used in dev environment),
   * returns an empty observable.
   *
   * @param doi - The DOI (Digital Object Identifier) of the resource.
   * @returns An Observable that completes when the request is sent.
   */
  logDownload(doi: string): Observable<void> {
    return this.logActivity(DataciteEvent.DOWNLOAD, doi);
  }

  /**
   * Internal helper to log a specific Datacite event for a given DOI.
   *
   * @param event - The Datacite event type (VIEW or DOWNLOAD).
   * @param doi - The DOI (Digital Object Identifier) of the resource.
   * @returns An Observable that completes when the HTTP POST is sent,
   *          or EMPTY if DOI or repo ID is missing.
   */
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
    return this.#http.post(this.#environment.dataciteTrackerAddress, payload, { headers }).pipe(
      map(() => {
        return;
      })
    );
  }
}
