import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@core/handlers';
import { PreprintsService } from '@osf/features/preprints/services';

import { FetchMyPreprints, FetchPreprintById } from './preprint.actions';
import { DefaultState, PreprintStateModel } from './preprint.model';

@State<PreprintStateModel>({
  name: 'preprints',
  defaults: { ...DefaultState },
})
@Injectable()
export class PreprintState {
  private preprintsService = inject(PreprintsService);

  @Action(FetchMyPreprints)
  fetchMyPreprints(ctx: StateContext<PreprintStateModel>, action: FetchMyPreprints) {
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

  @Action(FetchPreprintById)
  getPreprintById(ctx: StateContext<PreprintStateModel>, action: FetchPreprintById) {
    ctx.setState(patch({ preprint: patch({ isLoading: true }) }));

    return this.preprintsService.getById(action.id).pipe(
      tap((preprint) => {
        ctx.setState(patch({ preprint: patch({ isLoading: false, data: preprint }) }));
      }),
      catchError((error) => handleSectionError(ctx, 'preprint', error))
    );
  }
}
