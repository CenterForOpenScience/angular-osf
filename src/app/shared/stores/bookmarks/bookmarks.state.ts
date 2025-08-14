import { Action, State, StateContext } from '@ngxs/store';

import { catchError, EMPTY, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ResourceType } from '@shared/enums';
import { handleSectionError } from '@shared/helpers';
import { BookmarksService } from '@shared/services';

import { AddResourceToBookmarks, GetBookmarksCollectionId, RemoveResourceFromBookmarks } from './bookmarks.actions';
import { BookmarksStateModel } from './bookmarks.model';

const BOOKMARKS_DEFAULTS: BookmarksStateModel = {
  bookmarksId: {
    data: '',
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};

@State<BookmarksStateModel>({
  name: 'bookmarks',
  defaults: BOOKMARKS_DEFAULTS,
})
@Injectable()
export class BookmarksState {
  bookmarksService = inject(BookmarksService);

  @Action(GetBookmarksCollectionId)
  getBookmarksCollectionId(ctx: StateContext<BookmarksStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      bookmarksId: {
        ...state.bookmarksId,
        isLoading: true,
      },
    });

    return this.bookmarksService.getBookmarksCollectionId().pipe(
      tap((res) => {
        ctx.patchState({
          bookmarksId: {
            data: res,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'bookmarksId', error))
    );
  }

  @Action(AddResourceToBookmarks)
  addResourceToBookmarks(ctx: StateContext<BookmarksStateModel>, action: AddResourceToBookmarks) {
    const state = ctx.getState();
    ctx.patchState({
      bookmarksId: {
        ...state.bookmarksId,
        isSubmitting: true,
      },
    });

    switch (action.resourceType) {
      case ResourceType.Project:
        return this.bookmarksService.addProjectToBookmarks(action.bookmarksId, action.resourceId).pipe(
          tap(() => {
            ctx.patchState({
              bookmarksId: {
                ...state.bookmarksId,
                isSubmitting: false,
              },
            });
          }),
          catchError((error) => handleSectionError(ctx, 'bookmarksId', error))
        );
      case ResourceType.Registration:
        return this.bookmarksService.addRegistrationToBookmarks(action.bookmarksId, action.resourceId).pipe(
          tap(() => {
            ctx.patchState({
              bookmarksId: {
                ...state.bookmarksId,
                isSubmitting: false,
              },
            });
          }),
          catchError((error) => handleSectionError(ctx, 'bookmarksId', error))
        );
      default:
        return EMPTY;
    }
  }

  @Action(RemoveResourceFromBookmarks)
  removeResourceFromBookmarks(ctx: StateContext<BookmarksStateModel>, action: RemoveResourceFromBookmarks) {
    const state = ctx.getState();
    ctx.patchState({
      bookmarksId: {
        ...state.bookmarksId,
        isSubmitting: true,
      },
    });

    switch (action.resourceType) {
      case ResourceType.Project:
        return this.bookmarksService.removeProjectFromBookmarks(action.bookmarksId, action.resourceId).pipe(
          tap(() => {
            ctx.patchState({
              bookmarksId: {
                ...state.bookmarksId,
                isSubmitting: false,
              },
            });
          }),
          catchError((error) => handleSectionError(ctx, 'bookmarksId', error))
        );
      case ResourceType.Registration:
        return this.bookmarksService.removeRegistrationFromBookmarks(action.bookmarksId, action.resourceId).pipe(
          tap(() => {
            ctx.patchState({
              bookmarksId: {
                ...state.bookmarksId,
                isSubmitting: false,
              },
            });
          }),
          catchError((error) => handleSectionError(ctx, 'bookmarksId', error))
        );
      default:
        return EMPTY;
    }
  }
}
