import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { Injectable } from '@angular/core';

import { CollectionsService } from '../services/collections.service';

import { AddProjectToBookmarks, GetBookmarksCollectionId, RemoveProjectFromBookmarks } from './collections.actions';
import { CollectionsStateModel } from './collections.model';

@State<CollectionsStateModel>({
  name: 'collections',
  defaults: {
    bookmarksId: {
      data: '',
      isLoading: false,
      isSubmitting: false,
      error: null,
    },
  },
})
@Injectable()
export class CollectionsState {
  constructor(private collectionsService: CollectionsService) {}

  @Action(GetBookmarksCollectionId)
  getBookmarksCollectionId(ctx: StateContext<CollectionsStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      bookmarksId: {
        ...state.bookmarksId,
        isLoading: true,
      },
    });

    return this.collectionsService.getBookmarksCollectionId().pipe(
      tap((res) => {
        ctx.patchState({
          bookmarksId: {
            data: res,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'bookmarksId', error))
    );
  }

  @Action(AddProjectToBookmarks)
  addProjectToBookmarks(ctx: StateContext<CollectionsStateModel>, action: AddProjectToBookmarks) {
    const state = ctx.getState();
    ctx.patchState({
      bookmarksId: {
        ...state.bookmarksId,
        isSubmitting: true,
      },
    });

    return this.collectionsService.addProjectToBookmarks(action.bookmarksId, action.projectId).pipe(
      tap(() => {
        ctx.patchState({
          bookmarksId: {
            ...state.bookmarksId,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'bookmarksId', error))
    );
  }

  @Action(RemoveProjectFromBookmarks)
  removeProjectFromBookmarks(ctx: StateContext<CollectionsStateModel>, action: RemoveProjectFromBookmarks) {
    const state = ctx.getState();
    ctx.patchState({
      bookmarksId: {
        ...state.bookmarksId,
        isSubmitting: true,
      },
    });

    return this.collectionsService.removeProjectFromBookmarks(action.bookmarksId, action.projectId).pipe(
      tap(() => {
        ctx.patchState({
          bookmarksId: {
            ...state.bookmarksId,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'bookmarksId', error))
    );
  }

  private handleError(ctx: StateContext<CollectionsStateModel>, section: keyof CollectionsStateModel, error: Error) {
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
