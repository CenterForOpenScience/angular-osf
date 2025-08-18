import { Action, State, StateContext } from '@ngxs/store';

import { catchError, of, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';

import { ModeratorModel } from '../../models';
import { ModeratorsService } from '../../services';

import {
  AddModerator,
  ClearUsers,
  DeleteModerator,
  LoadModerators,
  SearchUsers,
  UpdateModerator,
  UpdateSearchValue,
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

    return this.moderatorsService.getModerators(action.resourceId, action.resourceType).pipe(
      tap((moderators: ModeratorModel[]) => {
        ctx.patchState({
          moderators: {
            ...state.moderators,
            data: moderators,
            isLoading: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'moderators', error))
    );
  }

  @Action(UpdateSearchValue)
  updateSearchValue(ctx: StateContext<ModeratorsStateModel>, action: UpdateSearchValue) {
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
      tap((moderator) => {
        const currentState = ctx.getState();

        ctx.patchState({
          moderators: {
            ...currentState.moderators,
            data: [...currentState.moderators.data, moderator],
            isLoading: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'moderators', error))
    );
  }

  @Action(UpdateModerator)
  updateCollectionModerator(ctx: StateContext<ModeratorsStateModel>, action: UpdateModerator) {
    const state = ctx.getState();

    if (!action.resourceType) {
      return;
    }

    ctx.patchState({
      moderators: { ...state.moderators, isLoading: true, error: null },
    });

    return this.moderatorsService.updateModerator(action.resourceId, action.resourceType, action.moderator).pipe(
      tap((updatedModerator) => {
        const currentState = ctx.getState();

        ctx.patchState({
          moderators: {
            ...currentState.moderators,
            data: currentState.moderators.data.map((moderator) =>
              moderator.id === updatedModerator.id ? updatedModerator : moderator
            ),
            isLoading: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'moderators', error))
    );
  }

  @Action(DeleteModerator)
  deleteCollectionModerator(ctx: StateContext<ModeratorsStateModel>, action: DeleteModerator) {
    const state = ctx.getState();

    if (!action.resourceType) {
      return;
    }

    ctx.patchState({
      moderators: { ...state.moderators, isLoading: true, error: null },
    });

    return this.moderatorsService.deleteModerator(action.resourceId, action.resourceType, action.moderatorId).pipe(
      tap(() => {
        ctx.patchState({
          moderators: {
            ...state.moderators,
            data: state.moderators.data.filter((moderator) => moderator.userId !== action.moderatorId),
            isLoading: false,
          },
        });
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

    return this.moderatorsService.searchUsers(action.searchValue, action.page).pipe(
      tap((users) => {
        ctx.patchState({
          users: {
            data: users.data.filter((user) => !addedModeratorsIds.includes(user.id!)),
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
  clearUsers(ctx: StateContext<ModeratorsStateModel>) {
    ctx.patchState({ users: { data: [], isLoading: false, error: null, totalCount: 0 } });
  }
}
