import { Action, State, StateContext } from '@ngxs/store';

import { tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { AddToCollectionService } from '@osf/features/collections/services/add-to-collection.service';
import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { CollectionsService } from '@osf/shared/services/collections.service';

import {
  ClearAddToCollectionState,
  CreateCollectionSubmission,
  GetCollectionLicenses,
  GetCurrentCollectionSubmission,
  GetProviderDefaultLicense,
  RemoveCollectionSubmission,
  UpdateCollectionSubmission,
} from './add-to-collection.actions';
import { ADD_TO_COLLECTION_DEFAULTS, AddToCollectionStateModel } from './add-to-collection.model';

@State<AddToCollectionStateModel>({
  name: 'addToCollection',
  defaults: ADD_TO_COLLECTION_DEFAULTS,
})
@Injectable()
export class AddToCollectionState {
  addToCollectionService = inject(AddToCollectionService);
  collectionsService = inject(CollectionsService);

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

  @Action(GetProviderDefaultLicense)
  getProviderDefaultLicense(ctx: StateContext<AddToCollectionStateModel>, action: GetProviderDefaultLicense) {
    const state = ctx.getState();
    ctx.patchState({
      providerDefaultLicense: {
        ...state.providerDefaultLicense,
        isLoading: true,
      },
    });

    return this.addToCollectionService.fetchProviderDefaultLicense(action.providerId).pipe(
      tap((defaultLicense) => {
        ctx.patchState({
          providerDefaultLicense: {
            data: defaultLicense,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'collectionLicenses', error))
    );
  }

  @Action(GetCurrentCollectionSubmission)
  getCurrentCollectionSubmission(ctx: StateContext<AddToCollectionStateModel>, action: GetCurrentCollectionSubmission) {
    const state = ctx.getState();
    ctx.patchState({
      collectionLicenses: {
        ...state.collectionLicenses,
        isLoading: true,
      },
    });

    return this.collectionsService.fetchProjectSubmission(action.collectionId, action.projectId).pipe(
      tap((res) => {
        ctx.patchState({
          currentProjectSubmission: {
            data: res,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'currentProjectSubmission', error))
    );
  }

  @Action(CreateCollectionSubmission)
  createCollectionSubmission(ctx: StateContext<AddToCollectionStateModel>, action: CreateCollectionSubmission) {
    return this.addToCollectionService.createCollectionSubmission(action.metadata);
  }

  @Action(UpdateCollectionSubmission)
  updateCollectionSubmission(ctx: StateContext<AddToCollectionStateModel>, action: UpdateCollectionSubmission) {
    return this.addToCollectionService.updateCollectionSubmission(action.metadata);
  }

  @Action(RemoveCollectionSubmission)
  removeCollectionSubmission(ctx: StateContext<AddToCollectionStateModel>, action: RemoveCollectionSubmission) {
    return this.addToCollectionService.removeCollectionSubmission(action.payload);
  }

  @Action(ClearAddToCollectionState)
  clearAddToCollection(ctx: StateContext<AddToCollectionStateModel>) {
    ctx.patchState(ADD_TO_COLLECTION_DEFAULTS);
  }
}
