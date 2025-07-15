import { Action, State, StateContext } from '@ngxs/store';

import { tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@core/handlers';
import { AddToCollectionService } from '@osf/features/collections/services/add-to-collection.service';

import {
  ClearAddToCollectionState,
  CreateCollectionSubmission,
  GetCollectionLicenses,
} from './add-to-collection.actions';
import { AddToCollectionStateModel } from './add-to-collection.model';

const ADD_TO_COLLECTION_DEFAULTS = {
  collectionLicenses: {
    data: [],
    isLoading: false,
    error: null,
  },
};

@State<AddToCollectionStateModel>({
  name: 'addToCollection',
  defaults: ADD_TO_COLLECTION_DEFAULTS,
})
@Injectable()
export class AddToCollectionState {
  addToCollectionService = inject(AddToCollectionService);

  @Action(GetCollectionLicenses)
  getCollectionLicenses(ctx: StateContext<AddToCollectionStateModel>, action: GetCollectionLicenses) {
    const state = ctx.getState();
    ctx.patchState({
      collectionLicenses: {
        ...state.collectionLicenses,
        isLoading: true,
      },
    });

    return this.addToCollectionService.fetchCollectionLicenses(action.providerId).pipe(
      tap((licenses) => {
        ctx.patchState({
          collectionLicenses: {
            data: licenses,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'collectionLicenses', error))
    );
  }

  @Action(CreateCollectionSubmission)
  createCollectionSubmission(ctx: StateContext<AddToCollectionStateModel>, action: CreateCollectionSubmission) {
    return this.addToCollectionService.createCollectionSubmission(action.metadata);
  }

  @Action(ClearAddToCollectionState)
  clearAddToCollection(ctx: StateContext<AddToCollectionStateModel>) {
    ctx.patchState(ADD_TO_COLLECTION_DEFAULTS);
  }
}
