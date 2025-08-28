import { filter, Observable, switchMap, take } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { DataciteService } from '@shared/services/datacite/datacite.service';

@Injectable()
export abstract class DataciteTrackerComponent {
  private dataciteService = inject(DataciteService);

  protected abstract getDoi(): Observable<string | null>;

  protected setupDataciteViewTrackerEffect(): Observable<void> {
    return this.getDoi().pipe(
      take(1),
      filter((doi): doi is string => !!doi),
      switchMap((doi) => this.dataciteService.logView(doi))
    );
  }
}
