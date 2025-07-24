import { Action, State, StateContext } from '@ngxs/store';

import { catchError, forkJoin, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { NodeLinksService } from '@shared/services/node-links.service';

import {
  ClearNodeLinks,
  CreateNodeLink,
  DeleteNodeLink,
  GetAllNodeLinks,
  GetLinkedResources,
} from './node-links.actions';
import { NODE_LINKS_DEFAULTS, NodeLinksStateModel } from './node-links.model';

@State<NodeLinksStateModel>({
  name: 'nodeLinks',
  defaults: NODE_LINKS_DEFAULTS,
})
@Injectable()
export class NodeLinksState {
  nodeLinksService = inject(NodeLinksService);

  @Action(CreateNodeLink)
  createNodeLink(ctx: StateContext<NodeLinksStateModel>, action: CreateNodeLink) {
    const state = ctx.getState();
    ctx.patchState({
      nodeLinks: {
        ...state.nodeLinks,
        isSubmitting: true,
      },
    });

    return this.nodeLinksService.createNodeLink(action.currentProjectId, action.linkProjectId).pipe(
      tap((nodeLink) => {
        ctx.patchState({
          nodeLinks: {
            data: [...state.nodeLinks.data, nodeLink],
            isSubmitting: false,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'nodeLinks', error))
    );
  }

  @Action(GetAllNodeLinks)
  getAllNodeLinks(ctx: StateContext<NodeLinksStateModel>, action: GetAllNodeLinks) {
    const state = ctx.getState();
    ctx.patchState({
      nodeLinks: {
        ...state.nodeLinks,
        isLoading: true,
      },
    });

    return this.nodeLinksService.fetchAllNodeLinks(action.projectId).pipe(
      tap((nodeLinks) => {
        ctx.patchState({
          nodeLinks: {
            data: nodeLinks,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'nodeLinks', error))
    );
  }

  @Action(GetLinkedResources)
  getLinkedResources(ctx: StateContext<NodeLinksStateModel>, action: GetLinkedResources) {
    const state = ctx.getState();
    ctx.patchState({
      linkedResources: {
        ...state.linkedResources,
        isLoading: true,
      },
    });

    return forkJoin({
      linkedProjects: this.nodeLinksService.fetchLinkedProjects(action.projectId),
      linkedRegistrations: this.nodeLinksService.fetchLinkedRegistrations(action.projectId),
    }).pipe(
      tap(({ linkedProjects, linkedRegistrations }) => {
        const combinedResources = [...linkedProjects, ...linkedRegistrations];
        ctx.patchState({
          linkedResources: {
            data: combinedResources,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'linkedResources', error))
    );
  }

  @Action(DeleteNodeLink)
  deleteNodeLink(ctx: StateContext<NodeLinksStateModel>, action: DeleteNodeLink) {
    const state = ctx.getState();

    ctx.patchState({
      nodeLinks: {
        ...state.nodeLinks,
        isSubmitting: true,
      },
    });

    return this.nodeLinksService.deleteNodeLink(action.projectId, action.nodeLinkId).pipe(
      tap(() => {
        const updatedNodeLinks = state.nodeLinks.data.filter((link) => link.id !== action.nodeLinkId);
        ctx.patchState({
          nodeLinks: {
            data: updatedNodeLinks,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      })
    );
  }

  @Action(ClearNodeLinks)
  clearNodeLinks(ctx: StateContext<NodeLinksStateModel>) {
    ctx.patchState(NODE_LINKS_DEFAULTS);
  }

  private handleError(ctx: StateContext<NodeLinksStateModel>, section: keyof NodeLinksStateModel, error: Error) {
    ctx.patchState({
      [section]: {
        ...ctx.getState()[section],
        isLoading: false,
        isSubmitting: false,
        error: error.message,
      },
    });
    return throwError(() => error);
  }
}
