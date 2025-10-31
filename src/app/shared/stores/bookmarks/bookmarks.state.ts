import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { BookmarksService } from '@osf/shared/services/bookmarks.service';

import { AddResourceToBookmarks, GetBookmarksCollectionId, RemoveResourceFromBookmarks } from './bookmarks.actions';
import { BOOKMARKS_DEFAULTS, BookmarksStateModel } from './bookmarks.model';

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

    return this.bookmarksService
      .addResourceToBookmarks(action.bookmarksId, action.resourceId, action.resourceType)
      .pipe(
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

    return this.bookmarksService
      .removeResourceFromBookmarks(action.bookmarksId, action.resourceId, action.resourceType)
      .pipe(
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
  }
}
