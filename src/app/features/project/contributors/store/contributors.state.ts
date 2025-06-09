import { Action, State, StateContext } from '@ngxs/store';

import { catchError, of, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ContributorsService } from '../services';

import {
  AddContributor,
  ClearUsers,
  DeleteContributor,
  GetAllContributors,
  SearchUsers,
  UpdateBibliographyFilter,
  UpdateContributor,
  UpdatePermissionFilter,
  UpdateSearchValue,
} from './contributors.actions';
import { ContributorsStateModel } from './contributors.model';

@State<ContributorsStateModel>({
  name: 'contributors',
  defaults: {
    contributorsList: {
      data: [],
      isLoading: false,
      error: '',
      searchValue: null,
      permissionFilter: null,
      bibliographyFilter: null,
    },
    users: {
      data: [],
      isLoading: false,
      error: null,
      totalCount: 0,
    },
  },
})
@Injectable()
export class ContributorsState {
  private readonly contributorsService = inject(ContributorsService);

  @Action(GetAllContributors)
  getAllContributors(ctx: StateContext<ContributorsStateModel>, action: GetAllContributors) {
    const state = ctx.getState();

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.contributorsService.getAllContributors(action.projectId).pipe(
      tap((contributors) => {
        ctx.patchState({
          contributorsList: {
            ...state.contributorsList,
            data: contributors,
            isLoading: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'contributorsList', error))
    );
  }

  @Action(AddContributor)
  addContributor(ctx: StateContext<ContributorsStateModel>, action: AddContributor) {
    const state = ctx.getState();

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.contributorsService.addContributor(action.projectId, action.contributor).pipe(
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
      catchError((error) => this.handleError(ctx, 'contributorsList', error))
    );
  }

  @Action(UpdateContributor)
  updateContributor(ctx: StateContext<ContributorsStateModel>, action: UpdateContributor) {
    const state = ctx.getState();

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.contributorsService.updateContributor(action.projectId, action.contributor).pipe(
      tap((updatedContributor) => {
        const currentState = ctx.getState();

        ctx.patchState({
          contributorsList: {
            ...currentState.contributorsList,
            data: currentState.contributorsList.data.map((contributor) =>
              contributor.id === updatedContributor.id ? updatedContributor : contributor
            ),
            isLoading: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'contributorsList', error))
    );
  }

  @Action(DeleteContributor)
  deleteContributor(ctx: StateContext<ContributorsStateModel>, action: DeleteContributor) {
    const state = ctx.getState();

    ctx.patchState({
      contributorsList: { ...state.contributorsList, isLoading: true, error: null },
    });

    return this.contributorsService.deleteContributor(action.projectId, action.contributorId).pipe(
      tap(() => {
        ctx.patchState({
          contributorsList: {
            ...state.contributorsList,
            data: state.contributorsList.data.filter((contributor) => contributor.userId !== action.contributorId),
            isLoading: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'contributorsList', error))
    );
  }

  @Action(UpdateSearchValue)
  updateSearchValue(ctx: StateContext<ContributorsStateModel>, action: UpdateSearchValue) {
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
      catchError((error) => this.handleError(ctx, 'users', error))
    );
  }

  @Action(ClearUsers)
  clearUsers(ctx: StateContext<ContributorsStateModel>) {
    ctx.patchState({ users: { data: [], isLoading: false, error: null, totalCount: 0 } });
  }

  private handleError(ctx: StateContext<ContributorsStateModel>, section: 'contributorsList' | 'users', error: Error) {
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
