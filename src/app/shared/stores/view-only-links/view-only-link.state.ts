import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { map, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { VIEW_ONLY_LINKS_SERVICE } from '@osf/shared/tokens';
import { NodeData, PaginatedViewOnlyLinksModel } from '@shared/models';

import {
  CreateViewOnlyLink,
  DeleteViewOnlyLink,
  FetchViewOnlyLinks,
  GetResourceDetails,
} from './view-only-link.actions';
import { ViewOnlyLinkStateModel } from './view-only-link.model';

@State<ViewOnlyLinkStateModel>({
  name: 'viewOnlyLinks',
  defaults: {
    viewOnlyLinks: {
      data: {} as PaginatedViewOnlyLinksModel,
      isLoading: false,
      error: null,
    },
    resourceDetails: {
      data: {} as NodeData,
      isLoading: false,
      error: null,
    },
  },
})
@Injectable()
export class ViewOnlyLinkState {
  private readonly viewOnlyLinksService = inject(VIEW_ONLY_LINKS_SERVICE);

  @Action(GetResourceDetails)
  getResourceDetails(ctx: StateContext<ViewOnlyLinkStateModel>, action: GetResourceDetails) {
    const state = ctx.getState();

    ctx.patchState({
      resourceDetails: { ...state.resourceDetails, isLoading: true, error: null },
    });

    return this.viewOnlyLinksService.getResourceById(action.projectId).pipe(
      map((response) => response?.data as NodeData),
      tap((details) => {
        const updatedDetails = {
          ...details,
          lastFetched: Date.now(),
        };

        ctx.patchState({
          resourceDetails: {
            data: updatedDetails,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'resourceDetails', error))
    );
  }

  @Action(FetchViewOnlyLinks)
  fetchViewOnlyLinks(ctx: StateContext<ViewOnlyLinkStateModel>, action: FetchViewOnlyLinks) {
    const state = ctx.getState();

    ctx.patchState({
      viewOnlyLinks: { ...state.viewOnlyLinks, isLoading: true, error: null },
    });

    return this.viewOnlyLinksService.getViewOnlyLinksData(action.projectId).pipe(
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
      catchError((error) => this.handleError(ctx, 'viewOnlyLinks', error))
    );
  }

  @Action(CreateViewOnlyLink)
  createViewOnlyLink(ctx: StateContext<ViewOnlyLinkStateModel>, action: CreateViewOnlyLink) {
    const state = ctx.getState();

    ctx.patchState({
      viewOnlyLinks: { ...state.viewOnlyLinks, isLoading: true, error: null },
    });

    return this.viewOnlyLinksService.createViewOnlyLink(action.projectId, action.payload).pipe(
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
      catchError((error) => this.handleError(ctx, 'viewOnlyLinks', error))
    );
  }

  @Action(DeleteViewOnlyLink)
  deleteViewOnlyLink(ctx: StateContext<ViewOnlyLinkStateModel>, action: DeleteViewOnlyLink) {
    const state = ctx.getState();

    ctx.patchState({
      viewOnlyLinks: { ...state.viewOnlyLinks, isLoading: true, error: null },
    });

    return this.viewOnlyLinksService.deleteLink(action.projectId, action.linkId).pipe(
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
      catchError((error) => this.handleError(ctx, 'viewOnlyLinks', error))
    );
  }

  private handleError(ctx: StateContext<ViewOnlyLinkStateModel>, section: keyof ViewOnlyLinkStateModel, error: Error) {
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
