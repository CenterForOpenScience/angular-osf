import { EMPTY, filter, map, Observable, of, switchMap, take } from 'rxjs';

import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BYPASS_ERROR_INTERCEPTOR } from '@core/interceptors/error-interceptor.tokens';
import { ENVIRONMENT } from '@core/provider/environment.provider';
import { Identifier, IdentifiersResponseJsonApi } from '@osf/shared/models';
import { DataciteEvent } from '@osf/shared/models/datacite/datacite-event.enum';

@Injectable({
  providedIn: 'root',
})
export class DataciteService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly environment = inject(ENVIRONMENT);

  get apiDomainUrl() {
    return this.environment.apiDomainUrl;
  }

  get dataciteTrackerAddress() {
    return this.environment.dataciteTrackerAddress;
  }

  get dataciteTrackerRepoId() {
    return this.environment.dataciteTrackerRepoId;
  }

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
    const url = `${this.apiDomainUrl}/v2/${targetType}/${targetId}/identifiers`;
    return this.http.get<IdentifiersResponseJsonApi>(url).pipe(
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
    if (!doi || !this.dataciteTrackerRepoId) {
      return EMPTY;
    }
    const payload = {
      n: event,
      u: window.location.href,
      i: this.dataciteTrackerRepoId,
      p: doi,
    };
    const success = navigator.sendBeacon(this.dataciteTrackerAddress, JSON.stringify(payload));
    if (success) {
      return of(void 0);
    } else {
      const headers = {
        'Content-Type': 'application/json',
      };
      const context = new HttpContext();
      context.set(BYPASS_ERROR_INTERCEPTOR, true);
      return this.http
        .post(this.dataciteTrackerAddress, payload, {
          headers,
          context,
        })
        .pipe(map(() => undefined));
    }
  }
}
