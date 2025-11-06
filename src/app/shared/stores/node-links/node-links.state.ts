import { Action, State, StateContext } from '@ngxs/store';

import { catchError, forkJoin, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { NodeLinksService } from '@osf/shared/services/node-links.service';

import { ClearNodeLinks, CreateNodeLink, DeleteNodeLink, GetLinkedResources } from './node-links.actions';
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
      linkedResources: {
        ...state.linkedResources,
        isSubmitting: true,
      },
    });

    return this.nodeLinksService.createNodeLink(action.currentProjectId, action.resource).pipe(
      tap(() => {
        ctx.dispatch(new GetLinkedResources(action.currentProjectId));
      }),
      catchError((error) => this.handleError(ctx, 'linkedResources', error))
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
            isSubmitting: false,
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
      linkedResources: {
        ...state.linkedResources,
        isSubmitting: true,
      },
    });

    return this.nodeLinksService.deleteNodeLink(action.projectId, action.linkedResource).pipe(
      tap(() => {
        const updatedResources = state.linkedResources.data.filter(
          (resource) => resource.id !== action.linkedResource.id
        );
        ctx.patchState({
          linkedResources: {
            data: updatedResources,
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
