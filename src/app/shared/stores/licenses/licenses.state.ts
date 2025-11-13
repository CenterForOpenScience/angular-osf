import { Action, State, StateContext } from '@ngxs/store';

import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { LicensesService } from '@osf/shared/services/licenses.service';

import { LoadAllLicenses } from './licenses.actions';
import { LICENSES_STATE_DEFAULTS, LicensesStateModel } from './licenses.model';

@State<LicensesStateModel>({
  name: 'licenses',
  defaults: LICENSES_STATE_DEFAULTS,
})
@Injectable()
export class LicensesState {
  private readonly licensesService = inject(LicensesService);

  @Action(LoadAllLicenses)
  loadAllLicenses(ctx: StateContext<LicensesStateModel>) {
    ctx.patchState({
      licenses: {
        data: [],
        isLoading: true,
        error: null,
      },
    });

    return this.licensesService.getAllLicenses().pipe(
      tap((data) => {
        ctx.patchState({
          licenses: {
            data: data,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => {
        const errorMessage = error?.error?.message || error?.message;
        ctx.patchState({
          licenses: {
            data: ctx.getState().licenses.data,
            isLoading: false,
            error: errorMessage,
          },
        });
        return throwError(() => error);
      })
    );
  }
}
