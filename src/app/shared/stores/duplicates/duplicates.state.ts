import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@shared/helpers';
import { DuplicatesService } from '@shared/services/duplicates.service';

import { ClearDuplicates, GetAllDuplicates } from './duplicates.actions';
import { DUPLICATES_DEFAULTS, DuplicatesStateModel } from './duplicates.model';

@State<DuplicatesStateModel>({
  name: 'duplicates',
  defaults: DUPLICATES_DEFAULTS,
})
@Injectable()
export class DuplicatesState {
  duplicatesService = inject(DuplicatesService);

  @Action(GetAllDuplicates)
  getDuplicates(ctx: StateContext<DuplicatesStateModel>, action: GetAllDuplicates) {
    const state = ctx.getState();
    ctx.patchState({
      duplicates: {
        ...state.duplicates,
        isLoading: true,
      },
    });

    return this.duplicatesService
      .fetchAllDuplicates(action.resourceId, action.resourceType, action.page, action.pageSize)
      .pipe(
        tap((response) => {
          ctx.patchState({
            duplicates: {
              data: response.data,
              isLoading: false,
              error: null,
              totalCount: response.totalCount,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'duplicates', error))
      );
  }

  @Action(ClearDuplicates)
  clearDuplicates(ctx: StateContext<DuplicatesStateModel>) {
    ctx.patchState(DUPLICATES_DEFAULTS);
  }
}
