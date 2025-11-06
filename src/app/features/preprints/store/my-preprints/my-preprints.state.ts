import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';

import { PreprintsService } from '../../services';

import { FetchMyPreprints } from './my-preprints.actions';
import { DEFAULT_MY_PREPRINTS_STATE, MyPreprintsStateModel } from './my-preprints.model';

@State<MyPreprintsStateModel>({
  name: 'myPreprints',
  defaults: { ...DEFAULT_MY_PREPRINTS_STATE },
})
@Injectable()
export class MyPreprintsState {
  private preprintsService = inject(PreprintsService);

  @Action(FetchMyPreprints)
  fetchMyPreprints(ctx: StateContext<MyPreprintsStateModel>, action: FetchMyPreprints) {
    ctx.setState(patch({ myPreprints: patch({ isLoading: true }) }));

    return this.preprintsService.getMyPreprints(action.pageNumber, action.pageSize, action.filters).pipe(
      tap((preprints) => {
        ctx.setState(
          patch({
            myPreprints: patch({
              isLoading: false,
              data: preprints.data,
              totalCount: preprints.totalCount,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'myPreprints', error))
    );
  }
}
