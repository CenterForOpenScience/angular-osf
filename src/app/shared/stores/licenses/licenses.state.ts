import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { LicensesService } from '@osf/shared/services/licenses.service';

import { FetchLicenses } from './licenses.actions';
import { LICENSES_STATE_DEFAULTS, LicensesStateModel } from './licenses.model';

@State<LicensesStateModel>({
  name: 'licenses',
  defaults: LICENSES_STATE_DEFAULTS,
})
@Injectable()
export class LicensesState {
  private readonly licensesService = inject(LicensesService);

  @Action(FetchLicenses)
  fetchLicenses(ctx: StateContext<LicensesStateModel>, { resourceType, providerId }: FetchLicenses) {
    ctx.patchState({
      licenses: {
        data: [],
        isLoading: true,
        error: null,
      },
    });

    return this.licensesService.getLicenses(resourceType, providerId).pipe(
      tap((data) => {
        ctx.patchState({
          licenses: {
            data: data,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'licenses', error))
    );
  }
}
