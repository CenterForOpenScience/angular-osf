import { Action, State, StateContext } from '@ngxs/store';

import { catchError, forkJoin, of, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { NodeModel } from '@osf/shared/models/nodes/base-node.model';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';
import { NodeLinksService } from '@osf/shared/services/node-links.service';

import {
  ClearNodeLinks,
  CreateNodeLink,
  DeleteNodeLink,
  GetLinkedResources,
  LoadMoreLinkedResources,
} from './node-links.actions';
import { NODE_LINKS_DEFAULTS, NodeLinksStateModel } from './node-links.model';

@State<NodeLinksStateModel>({
  name: 'nodeLinks',
  defaults: NODE_LINKS_DEFAULTS,
})
@Injectable()
export class NodeLinksState {
  nodeLinksService = inject(NodeLinksService);

  @Action(GetLinkedResources)
  getLinkedResources(ctx: StateContext<NodeLinksStateModel>, action: GetLinkedResources) {
    const state = ctx.getState();

    const page = action.page ?? state.linkedResources.page;
    const pageSize = action.pageSize ?? state.linkedResources.pageSize;

    ctx.patchState({
      linkedResources: {
        ...state.linkedResources,
        data: page === 1 ? [] : state.linkedResources.data,
        isLoading: page === 1,
        isLoadingMore: page > 1,
        error: null,
        hasChanges: false,
      },
    });

    const emptyPaginatedData: PaginatedData<NodeModel[]> = {
      data: [],
      totalCount: 0,
      pageSize: pageSize,
    };

    const shouldFetchProjects =
      page === 1 ||
      state.linkedResources.projectsTotalCount === 0 ||
      page <= Math.ceil(state.linkedResources.projectsTotalCount / pageSize);

    const shouldFetchRegistrations =
      page === 1 ||
      state.linkedResources.registrationsTotalCount === 0 ||
      page <= Math.ceil(state.linkedResources.registrationsTotalCount / pageSize);

    const projectsObservable = shouldFetchProjects
      ? this.nodeLinksService
          .fetchLinkedProjects(action.projectId, page, pageSize)
          .pipe(catchError(() => of(emptyPaginatedData)))
      : of(emptyPaginatedData);

    const registrationsObservable = shouldFetchRegistrations
      ? this.nodeLinksService
          .fetchLinkedRegistrations(action.projectId, page, pageSize)
          .pipe(catchError(() => of(emptyPaginatedData)))
      : of(emptyPaginatedData);

    return forkJoin({
      linkedProjects: projectsObservable,
      linkedRegistrations: registrationsObservable,
    }).pipe(
      tap(({ linkedProjects, linkedRegistrations }) => {
        const data =
          page === 1
            ? [...linkedProjects.data, ...linkedRegistrations.data]
            : [...state.linkedResources.data, ...linkedProjects.data, ...linkedRegistrations.data];

        ctx.patchState({
          linkedResources: {
            ...state.linkedResources,
            data,
            isLoading: false,
            isLoadingMore: false,
            isSubmitting: false,
            error: null,
            page: page,
            pageSize: pageSize,
            projectsTotalCount: linkedProjects.totalCount,
            registrationsTotalCount: linkedRegistrations.totalCount,
            hasChanges: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'linkedResources', error))
    );
  }

  @Action(LoadMoreLinkedResources)
  loadMoreLinkedResources(ctx: StateContext<NodeLinksStateModel>, action: LoadMoreLinkedResources) {
    const state = ctx.getState();
    const nextPage = state.linkedResources.page + 1;
    const nextPageSize = state.linkedResources.pageSize;

    return ctx.dispatch(new GetLinkedResources(action.projectId, nextPage, nextPageSize));
  }

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
        ctx.patchState({
          linkedResources: { ...ctx.getState().linkedResources, isSubmitting: false, hasChanges: true },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'linkedResources', error))
    );
  }

  @Action(DeleteNodeLink)
  deleteNodeLink(ctx: StateContext<NodeLinksStateModel>, action: DeleteNodeLink) {
    const state = ctx.getState();

    ctx.patchState({
      linkedResources: {
        ...state.linkedResources,
        isSubmitting: true,
        error: null,
      },
    });

    return this.nodeLinksService.deleteNodeLink(action.projectId, action.linkedResource).pipe(
      tap(() => {
        ctx.patchState({
          linkedResources: { ...ctx.getState().linkedResources, isSubmitting: false, hasChanges: true },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'linkedResources', error))
    );
  }

  @Action(ClearNodeLinks)
  clearNodeLinks(ctx: StateContext<NodeLinksStateModel>) {
    ctx.patchState(NODE_LINKS_DEFAULTS);
  }
}
