import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { PreprintsService } from '@osf/features/preprints/services';
import {
  GetPreprintProviderById,
  GetPreprintProvidersToAdvertise,
} from '@osf/features/preprints/store/preprints.actions';
import { PreprintsStateModel } from '@osf/features/preprints/store/preprints.model';

@State<PreprintsStateModel>({
  name: 'preprints',
  defaults: {
    preprintProviderDetails: {
      data: null,
      isLoading: false,
      error: null,
    },
    preprintProvidersToAdvertise: {
      data: [],
      isLoading: false,
      error: null,
    },
  },
})
@Injectable()
export class PreprintsState {
  #preprintsService = inject(PreprintsService);

  @Action(GetPreprintProviderById)
  getPreprintProviderById(ctx: StateContext<PreprintsStateModel>, action: GetPreprintProviderById) {
    ctx.setState(patch({ preprintProviderDetails: patch({ isLoading: true }) }));

    return this.#preprintsService.getPreprintProviderById(action.id).pipe(
      tap((data) => {
        ctx.setState(
          patch({
            preprintProviderDetails: patch({
              data: data,
              isLoading: false,
            }),
          })
        );
      })
    );
  }

  @Action(GetPreprintProvidersToAdvertise)
  getPreprintProvidersToAdvertise(ctx: StateContext<PreprintsStateModel>) {
    ctx.setState(patch({ preprintProvidersToAdvertise: patch({ isLoading: true }) }));

    return this.#preprintsService.getPreprintProvidersToAdvertise().pipe(
      tap((data) => {
        ctx.setState(
          patch({
            preprintProvidersToAdvertise: patch({
              data: data,
              isLoading: false,
            }),
          })
        );
      })
    );
  }
}
