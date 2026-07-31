import { Action, State, StateContext } from '@ngxs/store';

import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SetCurrentProvider } from '@core/store/provider';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { CollectionsService } from '@osf/shared/services/collections.service';

import {
  ClearCollections,
  GetCollectionProvider,
  GetProjectSubmissions,
  GetUserCollectionSubmissions,
} from './collections.actions';
import { COLLECTIONS_DEFAULTS, CollectionsStateModel } from './collections.model';

@State<CollectionsStateModel>({
  name: 'collections',
  defaults: COLLECTIONS_DEFAULTS,
})
@Injectable()
export class CollectionsState {
  router = inject(Router);
  collectionsService = inject(CollectionsService);

  @Action(GetCollectionProvider)
  getCollectionProvider(ctx: StateContext<CollectionsStateModel>, action: GetCollectionProvider) {
    const state = ctx.getState();
    ctx.patchState({
      collectionProvider: {
        ...state.collectionProvider,
        isLoading: true,
      },
    });

    const provider = state.collectionProvider.data;

    if (provider?.name === action.collectionName) {
      ctx.dispatch(
        new SetCurrentProvider({
          id: provider.id,
          name: provider.name,
          type: CurrentResourceType.Collections,
          permissions: provider.permissions,
        })
      );

      return of(provider);
    }

    return this.collectionsService.getCollectionProvider(action.collectionName).pipe(
      tap((res) => {
        ctx.patchState({
          collectionProvider: {
            data: res,
            isLoading: false,
            error: null,
          },
        });

        ctx.dispatch(
          new SetCurrentProvider({
            id: res.id,
            name: res.name,
            type: CurrentResourceType.Collections,
            permissions: res.permissions,
          })
        );
      }),
      catchError((error) => {
        if (error.status === 404) {
          this.router.navigate(['/not-found']);
          return of(null);
        }
        return handleSectionError(ctx, 'collectionProvider', error);
      })
    );
  }

  @Action(GetProjectSubmissions)
  getProjectSubmissions(ctx: StateContext<CollectionsStateModel>, action: GetProjectSubmissions) {
    const state = ctx.getState();
    ctx.patchState({
      currentProjectSubmissions: {
        ...state.currentProjectSubmissions,
        isLoading: true,
      },
    });
    return this.collectionsService.fetchProjectCollections(action.projectId, true, false).pipe(
      switchMap((res) => {
        const collections = res;
        if (!collections.length) {
          return of([]);
        }

        const submissionRequests = collections.map((collection) =>
          this.collectionsService.fetchCurrentSubmission(action.projectId, collection.id).pipe(
            switchMap((submission) =>
              this.collectionsService.getCollectionProvider(submission.collectionId).pipe(
                map((provider) => ({
                  ...submission,
                  requiredMetadataTemplateId: provider.requiredMetadataTemplate?.id ?? null,
                })),
                catchError(() => of(submission))
              )
            )
          )
        );

        return forkJoin(submissionRequests);
      }),
      tap((submissions) => {
        ctx.patchState({
          currentProjectSubmissions: {
            data: submissions,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'currentProjectSubmissions', error))
    );
  }

  @Action(ClearCollections)
  clearCollections(ctx: StateContext<CollectionsStateModel>) {
    ctx.patchState(COLLECTIONS_DEFAULTS);
  }

  @Action(GetUserCollectionSubmissions)
  getUserCollectionSubmissions(ctx: StateContext<CollectionsStateModel>, action: GetUserCollectionSubmissions) {
    const state = ctx.getState();
    ctx.patchState({
      userCollectionSubmissions: {
        ...state.userCollectionSubmissions,
        isLoading: true,
      },
    });

    return this.collectionsService.fetchAllUserCollectionSubmissions(action.providerId, action.projectsIds).pipe(
      tap((res) => {
        ctx.patchState({
          userCollectionSubmissions: {
            data: res,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'userCollectionSubmissions', error))
    );
  }
}
