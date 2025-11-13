import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { BookmarksService } from '@osf/shared/services/bookmarks.service';

import {
  AddResourceToBookmarks,
  GetAllMyBookmarks,
  GetBookmarksCollectionId,
  GetResourceBookmark,
  RemoveResourceFromBookmarks,
} from './bookmarks.actions';
import { BOOKMARKS_DEFAULTS, BookmarksStateModel } from './bookmarks.model';

@State<BookmarksStateModel>({
  name: 'bookmarks',
  defaults: BOOKMARKS_DEFAULTS,
})
@Injectable()
export class BookmarksState {
  private readonly bookmarksService = inject(BookmarksService);

  @Action(GetBookmarksCollectionId)
  getBookmarksCollectionId(ctx: StateContext<BookmarksStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      bookmarkCollectionId: {
        ...state.bookmarkCollectionId,
        isLoading: true,
      },
    });

    return this.bookmarksService.getBookmarksCollectionId().pipe(
      tap((res) => {
        ctx.patchState({
          bookmarkCollectionId: {
            data: res,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'bookmarkCollectionId', error))
    );
  }

  @Action(GetAllMyBookmarks)
  getAllMyBookmarks(ctx: StateContext<BookmarksStateModel>, action: GetAllMyBookmarks) {
    const state = ctx.getState();

    ctx.patchState({
      items: {
        ...state.items,
        isLoading: true,
        error: null,
      },
    });

    return this.bookmarksService.getAllBookmarks(action.bookmarkCollectionId, action.filters).pipe(
      tap((results) => {
        ctx.patchState({
          items: {
            data: results.data,
            isLoading: false,
            error: null,
            totalCount: results.totalCount,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'items', error))
    );
  }

  @Action(GetResourceBookmark)
  getBookmarkResource(ctx: StateContext<BookmarksStateModel>, action: GetResourceBookmark) {
    ctx.patchState({
      items: {
        data: [],
        isLoading: true,
        error: null,
        totalCount: 0,
      },
    });

    return this.bookmarksService.getResourceBookmarks(action.bookmarkCollectionId, action.resourceType).pipe(
      tap((res) => {
        ctx.patchState({
          items: {
            data: res.data,
            isLoading: false,
            error: null,
            totalCount: res.meta.total,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'items', error))
    );
  }

  @Action(AddResourceToBookmarks)
  addResourceToBookmarks(ctx: StateContext<BookmarksStateModel>, action: AddResourceToBookmarks) {
    const state = ctx.getState();
    ctx.patchState({
      bookmarkCollectionId: {
        ...state.bookmarkCollectionId,
        isSubmitting: true,
      },
    });

    return this.bookmarksService
      .addResourceToBookmarks(action.bookmarkCollectionId, action.resourceId, action.resourceType)
      .pipe(
        tap(() => {
          ctx.patchState({
            bookmarkCollectionId: {
              ...state.bookmarkCollectionId,
              isSubmitting: false,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'bookmarkCollectionId', error))
      );
  }

  @Action(RemoveResourceFromBookmarks)
  removeResourceFromBookmarks(ctx: StateContext<BookmarksStateModel>, action: RemoveResourceFromBookmarks) {
    const state = ctx.getState();
    ctx.patchState({
      bookmarkCollectionId: {
        ...state.bookmarkCollectionId,
        isSubmitting: true,
      },
    });

    return this.bookmarksService
      .removeResourceFromBookmarks(action.bookmarkCollectionId, action.resourceId, action.resourceType)
      .pipe(
        tap(() => {
          ctx.patchState({
            bookmarkCollectionId: {
              ...state.bookmarkCollectionId,
              isSubmitting: false,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'bookmarkCollectionId', error))
      );
  }
}
