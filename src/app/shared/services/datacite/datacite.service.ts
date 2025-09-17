import { EMPTY, filter, map, Observable, of, switchMap, take } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { Identifier } from '@shared/models';
import { DataciteEvent } from '@shared/models/datacite/datacite-event.enum';
import { IdentifiersJsonApiResponse } from '@shared/models/identifiers/identifier-json-api.model';

@Injectable({
  providedIn: 'root',
})
export class DataciteService {
  private http: HttpClient = inject(HttpClient);
  private environment = inject(ENVIRONMENT);

  logIdentifiableView(trackable: Observable<{ identifiers?: Identifier[] } | null>) {
    return this.watchIdentifiable(trackable, DataciteEvent.VIEW);
  }

  logIdentifiableDownload(trackable: Observable<{ identifiers?: Identifier[] } | null>) {
    return this.watchIdentifiable(trackable, DataciteEvent.DOWNLOAD);
  }

  logFileDownload(targetId: string, targetType: string) {
    return this.logFile(targetId, targetType, DataciteEvent.DOWNLOAD);
  }

  logFileView(targetId: string, targetType: string) {
    return this.logFile(targetId, targetType, DataciteEvent.VIEW);
  }

  private watchIdentifiable(
    trackable: Observable<{ identifiers?: Identifier[] } | null>,
    event: DataciteEvent
  ): Observable<void> {
    return trackable.pipe(
      filter((item) => item != null),
      map((item) => item?.identifiers?.find((identifier) => identifier.category == 'doi')?.value ?? null),
      filter((doi): doi is string => !!doi),
      take(1),
      switchMap((doi) => this.logActivity(event, doi))
    );
  }

  private logFile(targetId: string, targetType: string, event: DataciteEvent): Observable<void> {
    const url = `${this.environment.webUrl}/${targetType}/${targetId}/identifiers`;
    return this.http.get<IdentifiersJsonApiResponse>(url).pipe(
      map((item) => ({
        identifiers: item.data.map<Identifier>((identifierData) => ({
          id: identifierData.id,
          type: identifierData.type,
          category: identifierData.attributes.category,
          value: identifierData.attributes.value,
        })),
      })),
      switchMap((trackable) => this.watchIdentifiable(of(trackable), event))
    );
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
    if (!doi || !this.environment.dataciteTrackerRepoId) {
      return EMPTY;
    }
    const payload = {
      n: event,
      u: window.location.href,
      i: this.environment.dataciteTrackerRepoId,
      p: doi,
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    return this.http.post(this.environment.dataciteTrackerAddress, payload, { headers }).pipe(
      map(() => {
        return;
      })
    );
  }
}
