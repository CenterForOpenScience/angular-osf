import { Action, State, StateContext } from '@ngxs/store';

import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { LicensesService } from '@core/services/licenses.service';
import { LicensesStateModel, LoadAllLicenses } from '@shared/stores/licenses';

const defaultState: LicensesStateModel = {
  licenses: {
    data: [],
    isLoading: false,
    error: null,
  },
};

@State<LicensesStateModel>({
  name: 'licenses',
  defaults: defaultState,
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
      tap((response) => {
        ctx.patchState({
          licenses: {
            data: response.data,
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
