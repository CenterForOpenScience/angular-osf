import { Action, State, StateContext } from '@ngxs/store';

import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { LicensesService } from '@osf/shared/services/licenses.service';

import { FetchLicense, FetchLicenses } from './licenses.actions';
import { LICENSES_STATE_DEFAULTS, LicensesStateModel } from './licenses.model';

@State<LicensesStateModel>({
  name: 'licenses',
  defaults: LICENSES_STATE_DEFAULTS,
})
@Injectable()
export class LicensesState {
  private readonly licensesService = inject(LicensesService);

  @Action(FetchLicenses)
  fetchLicenses(ctx: StateContext<LicensesStateModel>, { licensesUrl }: FetchLicenses) {
    if (!licensesUrl) {
      return EMPTY;
    }

    ctx.patchState({
      licenses: {
        data: [],
        isLoading: true,
        error: null,
      },
    });

    return this.licensesService.getLicenses(licensesUrl).pipe(
      tap((data) => {
        ctx.patchState({
          licenses: {
            data,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'licenses', error))
    );
  }

  @Action(FetchLicense, { cancelUncompleted: true })
  fetchLicense(ctx: StateContext<LicensesStateModel>, { licenseId }: FetchLicense) {
    if (!licenseId) {
      ctx.patchState({
        license: {
          data: null,
          isLoading: false,
          error: null,
        },
      });
      return EMPTY;
    }

    ctx.patchState({
      license: {
        data: null,
        isLoading: true,
        error: null,
      },
    });

    return this.licensesService.getLicenseById(licenseId).pipe(
      tap((license) => {
        ctx.patchState({
          license: {
            data: license,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'license', error))
    );
  }
}
