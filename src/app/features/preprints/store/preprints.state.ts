import { Action, State, StateContext } from '@ngxs/store';
import { insertItem, patch, updateItem } from '@ngxs/store/operators';

import { of, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { PreprintsService } from '@osf/features/preprints/services';
import {
  GetHighlightedSubjectsByProviderId,
  GetPreprintProviderById,
  GetPreprintProvidersToAdvertise,
} from '@osf/features/preprints/store/preprints.actions';
import { PreprintsStateModel } from '@osf/features/preprints/store/preprints.model';

@State<PreprintsStateModel>({
  name: 'preprints',
  defaults: {
    preprintProvidersDetails: {
      data: [],
      isLoading: false,
      error: null,
    },
    preprintProvidersToAdvertise: {
      data: [],
      isLoading: false,
      error: null,
    },
    highlightedSubjectsForProvider: {
      data: [],
      isLoading: false,
      error: null,
    },
  },
})
@Injectable()
export class PreprintsState {
  #preprintsService = inject(PreprintsService);
  private readonly REFRESH_INTERVAL = 5 * 60 * 1000;

  @Action(GetPreprintProviderById)
  getPreprintProviderById(ctx: StateContext<PreprintsStateModel>, action: GetPreprintProviderById) {
    const state = ctx.getState();
    const cachedData = state.preprintProvidersDetails.data.find((p) => p.id === action.id);
    const shouldRefresh = this.shouldRefresh(cachedData?.lastFetched);

    if (cachedData && !shouldRefresh) {
      return of(cachedData);
    }

    ctx.setState(patch({ preprintProvidersDetails: patch({ isLoading: true }) }));

    return this.#preprintsService.getPreprintProviderById(action.id).pipe(
      tap((preprintProvider) => {
        const exists = state.preprintProvidersDetails.data.some((p) => p.id === preprintProvider.id);
        preprintProvider.lastFetched = Date.now();

        ctx.setState(
          patch({
            preprintProvidersDetails: patch({
              data: exists
                ? updateItem((p) => p.id === preprintProvider.id, preprintProvider)
                : insertItem(preprintProvider),
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => this.handleError(ctx, 'preprintProvidersDetails', error))
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
      }),
      catchError((error) => this.handleError(ctx, 'preprintProvidersToAdvertise', error))
    );
  }

  @Action(GetHighlightedSubjectsByProviderId)
  getHighlightedSubjectsByProviderId(
    ctx: StateContext<PreprintsStateModel>,
    action: GetHighlightedSubjectsByProviderId
  ) {
    ctx.setState(patch({ highlightedSubjectsForProvider: patch({ isLoading: true }) }));

    return this.#preprintsService.getHighlightedSubjectsByProviderId(action.providerId).pipe(
      tap((subjects) => {
        ctx.setState(
          patch({
            highlightedSubjectsForProvider: patch({
              data: subjects,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => this.handleError(ctx, 'highlightedSubjectsForProvider', error))
    );
  }

  private shouldRefresh(lastFetched: number | undefined): boolean {
    if (!lastFetched) {
      return true;
    }

    return Date.now() - lastFetched > this.REFRESH_INTERVAL;
  }

  private handleError(ctx: StateContext<PreprintsStateModel>, section: keyof PreprintsStateModel, error: Error) {
    ctx.patchState({
      [section]: {
        ...ctx.getState()[section],
        isLoading: false,
        error: error.message,
      },
    });
    return throwError(() => error);
  }
}
