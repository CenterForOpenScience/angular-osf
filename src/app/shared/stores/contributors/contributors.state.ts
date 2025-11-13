import { Action, State, StateContext } from '@ngxs/store';

import { catchError, of, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { ContributorsService } from '@osf/shared/services/contributors.service';
import { RequestAccessService } from '@osf/shared/services/request-access.service';

import {
  AcceptRequestAccess,
  AddContributor,
  BulkAddContributors,
  BulkAddContributorsFromParentProject,
  BulkUpdateContributors,
  ClearUsers,
  DeleteContributor,
  GetAllContributors,
  GetBibliographicContributors,
  GetRequestAccessContributors,
  LoadMoreBibliographicContributors,
  LoadMoreContributors,
  RejectRequestAccess,
  ResetContributorsState,
  SearchUsers,
  UpdateBibliographyFilter,
  UpdateContributorsSearchValue,
  UpdatePermissionFilter,
} from './contributors.actions';
import { CONTRIBUTORS_STATE_DEFAULTS, ContributorsStateModel } from './contributors.model';

@State<ContributorsStateModel>({
  name: 'contributors',
  defaults: CONTRIBUTORS_STATE_DEFAULTS,
})
@Injectable()
export class ContributorsState {
  private readonly contributorsService = inject(ContributorsService);
  private readonly requestAccessService = inject(RequestAccessService);

  @Action(GetAllContributors)
  getAllContributors(ctx: StateContext<ContributorsStateModel>, action: GetAllContributors) {
    const state = ctx.getState();

    if (!action.resourceId || !action.resourceType) {
      return;
    }

    const page = action.page ?? state.contributorsList.page;
    const pageSize = action.pageSize ?? state.contributorsList.pageSize;

    ctx.patchState({
      contributorsList: {
        ...state.contributorsList,
        data: page === 1 ? [] : state.contributorsList.data,
        isLoading: page === 1,
        isLoadingMore: page > 1,
        error: null,
      },
    });

    return this.contributorsService.getAllContributors(action.resourceType, action.resourceId, page, pageSize).pipe(
      tap((res) => {
        const data = page === 1 ? res.data : [...state.contributorsList.data, ...res.data];

        ctx.patchState({
          contributorsList: {
            ...state.contributorsList,
            data,
            isLoading: false,
            isLoadingMore: false,
            totalCount: res.totalCount,
            page,
            pageSize,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'contributorsList', error))
    );
  }

  @Action(GetRequestAccessContributors)
  getRequestAccessContributors(ctx: StateContext<ContributorsStateModel>, action: GetRequestAccessContributors) {
    const state = ctx.getState();

    if (!action.resourceId || !action.resourceType) {
      return;
    }

    ctx.patchState({
      requestAccessList: { ...state.requestAccessList, data: [], isLoading: true, error: null },
    });

    return this.requestAccessService.getRequestAccessList(action.resourceType, action.resourceId).pipe(
      tap((requestAccessList) => {
        ctx.patchState({
          requestAccessList: {
            ...state.requestAccessList,
            data: requestAccessList,
            isLoading: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'requestAccessList', error))
    );
  }

  @Action(AcceptRequestAccess)
  acceptRequestAccess(ctx: StateContext<ContributorsStateModel>, action: AcceptRequestAccess) {
    if (!action.requestId || !action.resourceType) {
      return;
    }

    ctx.patchState({
      requestAccessList: { data: [], isLoading: true, error: null },
    });

    return this.requestAccessService.acceptRequestAccess(action.resourceType, action.requestId, action.payload).pipe(
      tap(() => {
        ctx.dispatch(new GetAllContributors(action.resourceId, action.resourceType));
        ctx.dispatch(new GetRequestAccessContributors(action.resourceId, action.resourceType));
      }),
      catchError((error) => handleSectionError(ctx, 'requestAccessList', error))
    );
  }

  @Action(RejectRequestAccess)
  rejectRequestAccess(ctx: StateContext<ContributorsStateModel>, action: RejectRequestAccess) {
    if (!action.requestId || !action.resourceType) {
      return;
    }

    ctx.patchState({
      requestAccessList: { data: [], isLoading: true, error: null },
    });

    return this.requestAccessService.rejectRequestAccess(action.resourceType, action.requestId).pipe(
      tap(() => {
        ctx.dispatch(new GetAllContributors(action.resourceId, action.resourceType));
        ctx.dispatch(new GetRequestAccessContributors(action.resourceId, action.resourceType));
      }),
      catchError((error) => handleSectionError(ctx, 'requestAccessList', error))
    );
  }

  @Action(AddContributor)
  addContributor(ctx: StateContext<ContributorsStateModel>, action: AddContributor) {
    const state = ctx.getState();

    if (!action.resourceId || !action.resourceType) {
      return;
    }

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.contributorsService.addContributor(action.resourceType, action.resourceId, action.contributor).pipe(
      tap(() => {
        ctx.dispatch(
          new GetAllContributors(action.resourceId, action.resourceType, 1, state.contributorsList.pageSize)
        );
      }),
      catchError((error) => handleSectionError(ctx, 'contributorsList', error))
    );
  }

  @Action(BulkUpdateContributors)
  bulkUpdateContributors(ctx: StateContext<ContributorsStateModel>, action: BulkUpdateContributors) {
    const state = ctx.getState();

    if (!action.resourceId || !action.resourceType || !action.contributors.length) {
      return;
    }

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.contributorsService
      .bulkUpdateContributors(action.resourceType, action.resourceId, action.contributors)
      .pipe(
        tap(() => {
          ctx.dispatch(
            new GetAllContributors(action.resourceId, action.resourceType, 1, state.contributorsList.pageSize)
          );
        }),
        catchError((error) => handleSectionError(ctx, 'contributorsList', error))
      );
  }

  @Action(BulkAddContributors)
  bulkAddContributors(ctx: StateContext<ContributorsStateModel>, action: BulkAddContributors) {
    const state = ctx.getState();

    if (!action.resourceId || !action.resourceType || !action.contributors.length) {
      return;
    }

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.contributorsService
      .bulkAddContributors(action.resourceType, action.resourceId, action.contributors, action.childNodeIds)
      .pipe(
        tap(() => {
          ctx.dispatch(
            new GetAllContributors(action.resourceId, action.resourceType, 1, state.contributorsList.pageSize)
          );
        }),
        catchError((error) => handleSectionError(ctx, 'contributorsList', error))
      );
  }

  @Action(BulkAddContributorsFromParentProject)
  bulkAddContributorsFromParentProject(
    ctx: StateContext<ContributorsStateModel>,
    action: BulkAddContributorsFromParentProject
  ) {
    const state = ctx.getState();

    if (!action.resourceId || !action.resourceType) {
      return;
    }

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.contributorsService.addContributorsFromProject(action.resourceType, action.resourceId).pipe(
      tap(() => {
        ctx.dispatch(new GetAllContributors(action.resourceId, action.resourceType));
      }),
      catchError((error) => handleSectionError(ctx, 'contributorsList', error))
    );
  }

  @Action(DeleteContributor)
  deleteContributor(ctx: StateContext<ContributorsStateModel>, action: DeleteContributor) {
    const state = ctx.getState();

    if (!action.resourceId || !action.resourceType) {
      return;
    }

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.contributorsService
      .deleteContributor(action.resourceType, action.resourceId, action.contributorId)
      .pipe(
        tap(() => {
          if (!action.skipRefresh) {
            ctx.dispatch(
              new GetAllContributors(action.resourceId, action.resourceType, 1, state.contributorsList.pageSize)
            );
          }
        }),
        catchError((error) => handleSectionError(ctx, 'contributorsList', error))
      );
  }

  @Action(UpdateContributorsSearchValue)
  updateContributorsSearchValue(ctx: StateContext<ContributorsStateModel>, action: UpdateContributorsSearchValue) {
    ctx.patchState({ contributorsList: { ...ctx.getState().contributorsList, searchValue: action.searchValue } });
  }

  @Action(UpdatePermissionFilter)
  updatePermissionFilter(ctx: StateContext<ContributorsStateModel>, action: UpdatePermissionFilter) {
    ctx.patchState({
      contributorsList: { ...ctx.getState().contributorsList, permissionFilter: action.permissionFilter },
    });
  }

  @Action(UpdateBibliographyFilter)
  updateBibliographyFilter(ctx: StateContext<ContributorsStateModel>, action: UpdateBibliographyFilter) {
    ctx.patchState({
      contributorsList: { ...ctx.getState().contributorsList, bibliographyFilter: action.bibliographyFilter },
    });
  }

  @Action(SearchUsers)
  getAllUsers(ctx: StateContext<ContributorsStateModel>, action: SearchUsers) {
    const state = ctx.getState();

    ctx.patchState({
      users: { ...state.users, isLoading: true, error: null },
    });

    if (!action.searchValue) {
      return of([]);
    }

    return this.contributorsService.searchUsers(action.searchValue, action.page).pipe(
      tap((users) => {
        const addedContributorsIds = state.contributorsList.data.map((contributor) => contributor.userId);

        ctx.patchState({
          users: {
            data: users.data.map((user) => ({
              ...user,
              checked: addedContributorsIds.includes(user.id!),
              disabled: addedContributorsIds.includes(user.id!),
            })),
            isLoading: false,
            error: '',
            totalCount: users.totalCount,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'users', error))
    );
  }

  @Action(ClearUsers)
  clearUsers(ctx: StateContext<ContributorsStateModel>) {
    ctx.patchState({ users: { data: [], isLoading: false, error: null, totalCount: 0 } });
  }

  @Action(GetBibliographicContributors)
  getBibliographicContributors(ctx: StateContext<ContributorsStateModel>, action: GetBibliographicContributors) {
    const state = ctx.getState();

    if (!action.resourceId || !action.resourceType) {
      return;
    }

    ctx.patchState({
      bibliographicContributorsList: {
        ...state.bibliographicContributorsList,
        data: action.page === 1 ? [] : state.bibliographicContributorsList.data,
        isLoading: true,
        error: null,
      },
    });

    return this.contributorsService
      .getBibliographicContributors(action.resourceType, action.resourceId, action.page, action.pageSize)
      .pipe(
        tap((res) => {
          const data = action.page === 1 ? res.data : [...state.bibliographicContributorsList.data, ...res.data];

          ctx.patchState({
            bibliographicContributorsList: {
              data,
              isLoading: false,
              error: null,
              page: action.page,
              pageSize: res.pageSize,
              totalCount: res.totalCount,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'bibliographicContributorsList', error))
      );
  }

  @Action(LoadMoreBibliographicContributors)
  loadMoreBibliographicContributors(
    ctx: StateContext<ContributorsStateModel>,
    action: LoadMoreBibliographicContributors
  ) {
    const state = ctx.getState();
    const nextPage = state.bibliographicContributorsList.page + 1;
    const nextPageSize = state.bibliographicContributorsList.pageSize;

    return ctx.dispatch(
      new GetBibliographicContributors(action.resourceId, action.resourceType, nextPage, nextPageSize)
    );
  }

  @Action(LoadMoreContributors)
  loadMoreContributors(ctx: StateContext<ContributorsStateModel>, action: LoadMoreContributors) {
    const state = ctx.getState();
    const nextPage = state.contributorsList.page + 1;
    const nextPageSize = state.contributorsList.pageSize;

    return ctx.dispatch(new GetAllContributors(action.resourceId, action.resourceType, nextPage, nextPageSize));
  }

  @Action(ResetContributorsState)
  resetState(ctx: StateContext<ContributorsStateModel>) {
    ctx.setState({ ...CONTRIBUTORS_STATE_DEFAULTS });
  }
}
