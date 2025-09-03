import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { map } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';
import { PaginatedViewOnlyLinksModel } from '@osf/shared/models';
import { ViewOnlyLinksService } from '@osf/shared/services';

import { CreateViewOnlyLink, DeleteViewOnlyLink, FetchViewOnlyLinks } from './view-only-link.actions';
import { VIEW_ONLY_LINK_STATE_DEFAULTS, ViewOnlyLinkStateModel } from './view-only-link.model';

@State<ViewOnlyLinkStateModel>({
  name: 'viewOnlyLinks',
  defaults: VIEW_ONLY_LINK_STATE_DEFAULTS,
})
@Injectable()
export class ViewOnlyLinkState {
  private readonly viewOnlyLinksService = inject(ViewOnlyLinksService);

  @Action(FetchViewOnlyLinks)
  fetchViewOnlyLinks(ctx: StateContext<ViewOnlyLinkStateModel>, action: FetchViewOnlyLinks) {
    const state = ctx.getState();

    ctx.patchState({
      viewOnlyLinks: { ...state.viewOnlyLinks, isLoading: true, error: null },
    });

    if (!action.resourceType) {
      return;
    }

    return this.viewOnlyLinksService.getViewOnlyLinksData(action.resourceId, action.resourceType).pipe(
      map((response) => response),
      tap((links) => {
        ctx.patchState({
          viewOnlyLinks: {
            data: links,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'viewOnlyLinks', error))
    );
  }

  @Action(CreateViewOnlyLink)
  createViewOnlyLink(ctx: StateContext<ViewOnlyLinkStateModel>, action: CreateViewOnlyLink) {
    const state = ctx.getState();

    ctx.patchState({
      viewOnlyLinks: { ...state.viewOnlyLinks, isLoading: true, error: null },
    });

    if (!action.resourceType) {
      return;
    }

    return this.viewOnlyLinksService.createViewOnlyLink(action.resourceId, action.resourceType, action.payload).pipe(
      tap((data: PaginatedViewOnlyLinksModel) => {
        ctx.patchState({
          viewOnlyLinks: {
            data: {
              ...state.viewOnlyLinks.data,
              items: [data.items[0], ...state.viewOnlyLinks.data.items],
            },
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'viewOnlyLinks', error))
    );
  }

  @Action(DeleteViewOnlyLink)
  deleteViewOnlyLink(ctx: StateContext<ViewOnlyLinkStateModel>, action: DeleteViewOnlyLink) {
    const state = ctx.getState();

    ctx.patchState({
      viewOnlyLinks: { ...state.viewOnlyLinks, isLoading: true, error: null },
    });

    if (!action.resourceType) {
      return;
    }

    return this.viewOnlyLinksService.deleteLink(action.resourceId, action.resourceType, action.linkId).pipe(
      tap(() => {
        ctx.setState(
          patch({
            viewOnlyLinks: {
              data: {
                ...ctx.getState().viewOnlyLinks.data,
                items: ctx.getState().viewOnlyLinks.data.items.filter((item) => item.id !== action.linkId),
              },
              isLoading: false,
              error: null,
            },
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'viewOnlyLinks', error))
    );
  }
}
