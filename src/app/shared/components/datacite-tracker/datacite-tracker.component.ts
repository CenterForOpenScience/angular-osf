import { filter, map, Observable, switchMap, take } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { Identifier } from '@shared/models';
import { DataciteService } from '@shared/services/datacite/datacite.service';

@Injectable()
export abstract class DataciteTrackerComponent {
  private dataciteService = inject(DataciteService);
  /**
   * Abstract method to retrieve an observable of resource to be tracked.
   * This method is generic enough to support all objects that have `identifiers` property.
   * Must be implemented by subclasses.
   *
   * @returns An Observable that emits an item which may contain DOI identifier or null .
   */
  protected abstract get trackable(): Observable<{ identifiers?: Identifier[] } | null>;

  /**
   * Sets up a one-time effect to log a "view" event to Datacite for the resource DOI.
   * It waits until the DOI is available, takes the first non-null value,
   * and then calls `DataciteService.logView`.
   *
   * @returns An Observable that completes after logging the view.
   */
  protected setupDataciteViewTrackerEffect(): Observable<void> {
    return this.trackable.pipe(
      filter((item) => item != null),
      map((item) => item?.identifiers?.find((identifier) => identifier.category == 'doi')?.value ?? null),
      filter((doi): doi is string => !!doi),
      take(1),
      switchMap((doi) => this.dataciteService.logView(doi))
    );
  }
}
