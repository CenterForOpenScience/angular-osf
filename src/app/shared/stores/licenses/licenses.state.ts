import { Action, Selector, State, StateContext } from '@ngxs/store';

import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { LicensesService } from '@core/services/licenses.service';
import { License, LicensesStateModel } from '@shared/models';
import { LoadAllLicenses } from '@shared/stores';

const defaultState: LicensesStateModel = {
  licenses: [],
  loading: false,
  error: null,
};

@State<LicensesStateModel>({
  name: 'licenses',
  defaults: defaultState,
})
@Injectable()
export class LicensesState {
  private readonly licensesService = inject(LicensesService);

  @Selector()
  static getLicenses(state: LicensesStateModel): License[] {
    return state.licenses;
  }

  @Selector()
  static getLoading(state: LicensesStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static getError(state: LicensesStateModel): string | null {
    return state.error;
  }

  @Action(LoadAllLicenses)
  loadAllLicenses(ctx: StateContext<LicensesStateModel>) {
    ctx.patchState({ loading: true, error: null });

    return this.licensesService.getAllLicenses().pipe(
      tap((response) => {
        ctx.patchState({
          licenses: response.data,
          loading: false,
          error: null,
        });
      }),
      catchError((error) => {
        const errorMessage = error?.error?.message || error?.message;
        ctx.patchState({
          loading: false,
          error: errorMessage,
        });
        return throwError(() => error);
      })
    );
  }
}
