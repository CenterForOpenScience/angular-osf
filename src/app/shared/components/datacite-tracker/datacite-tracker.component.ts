import { filter, Observable, switchMap, take } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { DataciteService } from '@shared/services/datacite/datacite.service';

@Injectable()
export abstract class DataciteTrackerComponent {
  private dataciteService = inject(DataciteService);

  /**
   * Abstract method to retrieve the DOI (Digital Object Identifier) of the resource.
   * Must be implemented by subclasses.
   *
   * @returns An Observable that emits a string DOI or null if unavailable.
   */
  protected abstract getDoi(): Observable<string | null>;

  /**
   * Sets up a one-time effect to log a "view" event to Datacite for the resource DOI.
   * It waits until the DOI is available, takes the first non-null value,
   * and then calls `DataciteService.logView`.
   *
   * @returns An Observable that completes after logging the view.
   */
  protected setupDataciteViewTrackerEffect(): Observable<void> {
    return this.getDoi().pipe(
      take(1),
      filter((doi): doi is string => !!doi),
      switchMap((doi) => this.dataciteService.logView(doi))
    );
  }
}
