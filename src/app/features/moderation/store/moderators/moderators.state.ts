import { Action, State, StateContext } from '@ngxs/store';

import { catchError, of, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';

import { ModeratorModel } from '../../models';
import { ModeratorsService } from '../../services';

import {
  AddModerator,
  ClearUsers,
  DeleteModerator,
  LoadModerators,
  SearchUsers,
  SearchUsersPageChange,
  UpdateModerator,
  UpdateModeratorsSearchValue,
} from './moderators.actions';
import { MODERATORS_STATE_DEFAULTS, ModeratorsStateModel } from './moderators.model';

@State<ModeratorsStateModel>({
  name: 'moderation',
  defaults: MODERATORS_STATE_DEFAULTS,
})
@Injectable()
export class ModeratorsState {
  private readonly moderatorsService = inject(ModeratorsService);

  @Action(LoadModerators)
  loadModerators(ctx: StateContext<ModeratorsStateModel>, action: LoadModerators) {
    const state = ctx.getState();

    if (!action.resourceType) {
      return;
    }

    ctx.patchState({
      moderators: { ...state.moderators, isLoading: true, error: null },
    });

    const searchValue = state.moderators.searchValue;

    return this.moderatorsService
      .getModerators(action.resourceId, action.resourceType, searchValue, action.pageNumber, action.pageSize)
      .pipe(
        tap((res: PaginatedData<ModeratorModel[]>) => {
          ctx.patchState({
            moderators: {
              ...state.moderators,
              data: res.data,
              isLoading: false,
              totalCount: res.totalCount,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'moderators', error))
      );
  }

  @Action(UpdateModeratorsSearchValue)
  updateModeratorsSearchValue(ctx: StateContext<ModeratorsStateModel>, action: UpdateModeratorsSearchValue) {
    ctx.patchState({
      moderators: { ...ctx.getState().moderators, searchValue: action.searchValue },
    });
  }

  @Action(AddModerator)
  addModerator(ctx: StateContext<ModeratorsStateModel>, action: AddModerator) {
    const state = ctx.getState();

    if (!action.resourceType) {
      return;
    }

    ctx.patchState({
      moderators: { ...state.moderators, isLoading: true, error: null },
    });

    return this.moderatorsService.addModerator(action.resourceId, action.resourceType, action.moderator).pipe(
      tap(() => {
        ctx.dispatch(new LoadModerators(action.resourceId, action.resourceType));
      }),
      catchError((error) => handleSectionError(ctx, 'moderators', error))
    );
  }

  @Action(UpdateModerator)
  updateModerator(ctx: StateContext<ModeratorsStateModel>, action: UpdateModerator) {
    const state = ctx.getState();

    if (!action.resourceType) {
      return;
    }

    ctx.patchState({
      moderators: { ...state.moderators, isLoading: true, error: null },
    });

    return this.moderatorsService.updateModerator(action.resourceId, action.resourceType, action.moderator).pipe(
      tap(() => {
        ctx.dispatch(new LoadModerators(action.resourceId, action.resourceType));
      }),
      catchError((error) => handleSectionError(ctx, 'moderators', error))
    );
  }

  @Action(DeleteModerator)
  deleteModerator(ctx: StateContext<ModeratorsStateModel>, action: DeleteModerator) {
    const state = ctx.getState();

    if (!action.resourceType) {
      return;
    }

    ctx.patchState({
      moderators: { ...state.moderators, isLoading: true, error: null },
    });

    return this.moderatorsService.deleteModerator(action.resourceId, action.resourceType, action.moderatorId).pipe(
      tap(() => {
        ctx.dispatch(new LoadModerators(action.resourceId, action.resourceType));
      }),
      catchError((error) => handleSectionError(ctx, 'moderators', error))
    );
  }

  @Action(SearchUsers)
  searchUsers(ctx: StateContext<ModeratorsStateModel>, action: SearchUsers) {
    const state = ctx.getState();

    ctx.patchState({
      users: { ...state.users, isLoading: true, error: null },
    });

    const addedModeratorsIds = state.moderators.data.map((moderator) => moderator.userId);

    if (!action.searchValue) {
      return of([]);
    }

    return this.moderatorsService.searchUsers(action.searchValue).pipe(
      tap((response) => {
        ctx.patchState({
          users: {
            data: response.users.filter((user) => !addedModeratorsIds.includes(user.id!)),
            isLoading: false,
            error: '',
            totalCount: response.totalCount,
            next: response.next,
            previous: response.previous,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'users', error))
    );
  }

  @Action(SearchUsersPageChange)
  searchUsersPageChange(ctx: StateContext<ModeratorsStateModel>, action: SearchUsersPageChange) {
    const state = ctx.getState();

    ctx.patchState({
      users: { ...state.users, isLoading: true, error: null },
    });

    const addedModeratorsIds = state.moderators.data.map((moderator) => moderator.userId);

    return this.moderatorsService.getUsersByLink(action.link).pipe(
      tap((response) => {
        ctx.patchState({
          users: {
            data: response.users.filter((user) => !addedModeratorsIds.includes(user.id!)),
            isLoading: false,
            error: '',
            totalCount: response.totalCount,
            next: response.next,
            previous: response.previous,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'users', error))
    );
  }

  @Action(ClearUsers)
  clearUsers(ctx: StateContext<ModeratorsStateModel>) {
    ctx.patchState({
      users: { data: [], isLoading: false, error: null, totalCount: 0, next: null, previous: null },
    });
  }
}
