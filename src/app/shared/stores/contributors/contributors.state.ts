import { Action, State, StateContext } from '@ngxs/store';

import { catchError, of, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';
import { ContributorsService, RequestAccessService } from '@osf/shared/services';

import {
  AcceptRequestAccess,
  AddContributor,
  BulkAddContributors,
  BulkUpdateContributors,
  ClearUsers,
  DeleteContributor,
  GetAllContributors,
  GetRequestAccessContributors,
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

    ctx.patchState({
      contributorsList: { ...state.contributorsList, data: [], isLoading: true, error: null },
    });

    return this.contributorsService.getAllContributors(action.resourceType, action.resourceId).pipe(
      tap((contributors) => {
        ctx.patchState({
          contributorsList: {
            ...state.contributorsList,
            data: contributors,
            isLoading: false,
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
    const state = ctx.getState();

    if (!action.requestId || !action.resourceType) {
      return;
    }

    ctx.patchState({
      requestAccessList: { data: [], isLoading: true, error: null },
    });

    return this.requestAccessService.acceptRequestAccess(action.resourceType, action.requestId, action.payload).pipe(
      tap(() => {
        const dataList = state.requestAccessList.data.filter((item) => item.id !== action.requestId);

        ctx.dispatch(new GetAllContributors(action.resourceId, action.resourceType));

        ctx.patchState({
          requestAccessList: { data: dataList, isLoading: false, error: null },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'requestAccessList', error))
    );
  }

  @Action(RejectRequestAccess)
  rejectRequestAccess(ctx: StateContext<ContributorsStateModel>, action: RejectRequestAccess) {
    const state = ctx.getState();

    if (!action.requestId || !action.resourceType) {
      return;
    }

    ctx.patchState({
      requestAccessList: { data: [], isLoading: true, error: null },
    });

    return this.requestAccessService.rejectRequestAccess(action.resourceType, action.requestId).pipe(
      tap(() => {
        const dataList = state.requestAccessList.data.filter((item) => item.id !== action.requestId);

        ctx.dispatch(new GetAllContributors(action.resourceId, action.resourceType));

        ctx.patchState({
          requestAccessList: { data: dataList, isLoading: false, error: null },
        });
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
      tap((contributor) => {
        const currentState = ctx.getState();

        ctx.patchState({
          contributorsList: {
            ...currentState.contributorsList,
            data: [...currentState.contributorsList.data, contributor],
            isLoading: false,
          },
        });
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
          ctx.dispatch(new GetAllContributors(action.resourceId, action.resourceType));
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
      .bulkAddContributors(action.resourceType, action.resourceId, action.contributors)
      .pipe(
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
          ctx.patchState({
            contributorsList: {
              ...state.contributorsList,
              data: state.contributorsList.data.filter((contributor) => contributor.userId !== action.contributorId),
              isLoading: false,
            },
          });
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

    const addedContributorsIds = state.contributorsList.data.map((contributor) => contributor.userId);

    if (!action.searchValue) {
      return of([]);
    }

    return this.contributorsService.searchUsers(action.searchValue, action.page).pipe(
      tap((users) => {
        ctx.patchState({
          users: {
            data: users.data.filter((user) => !addedContributorsIds.includes(user.id!)),
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

  @Action(ResetContributorsState)
  resetState(ctx: StateContext<ContributorsStateModel>) {
    ctx.setState({ ...CONTRIBUTORS_STATE_DEFAULTS });
  }
}
