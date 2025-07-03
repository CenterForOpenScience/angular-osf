import { Action, State, StateContext } from '@ngxs/store';

import { tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { CollectionLicensesService } from '@osf/features/collections/services/collection-licenses.service';

import { GetCollectionLicenses } from './add-to-collection.actions';
import { AddToCollectionStateModel } from './add-to-collection.model';

@State<AddToCollectionStateModel>({
  name: 'addToCollection',
  defaults: {
    collectionLicenses: {
      data: [],
      isLoading: false,
      error: null,
    },
  },
})
@Injectable()
export class AddToCollectionState {
  collectionLicensesService = inject(CollectionLicensesService);

  @Action(GetCollectionLicenses)
  getCollectionLicenses(ctx: StateContext<AddToCollectionStateModel>, action: GetCollectionLicenses) {
    const state = ctx.getState();
    ctx.patchState({
      collectionLicenses: {
        ...state.collectionLicenses,
        isLoading: true,
      },
    });

    return this.collectionLicensesService.fetchCollectionLicenses(action.providerId).pipe(
      tap((licenses) => {
        ctx.patchState({
          collectionLicenses: {
            data: licenses,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'collectionLicenses', error))
    );
  }

  private handleError(
    ctx: StateContext<AddToCollectionStateModel>,
    section: keyof AddToCollectionStateModel,
    error: Error
  ) {
    const state = ctx.getState();

    ctx.patchState({
      [section]: {
        ...state[section],
        isLoading: false,
        isSubmitting: false,
        error: error.message,
      },
    });

    return throwError(() => error);
  }
}
