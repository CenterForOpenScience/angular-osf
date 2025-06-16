import { Action, State, StateContext } from '@ngxs/store';

import { catchError, of, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ModeratorModel } from '../models';
import { ModerationService } from '../services';

import {
  AddCollectionModerator,
  ClearUsers,
  DeleteCollectionModerator,
  LoadCollectionModerators,
  SearchUsers,
  UpdateCollectionModerator,
  UpdateCollectionSearchValue,
} from './moderation.actions';
import { ModerationStateModel } from './moderation.model';

@State<ModerationStateModel>({
  name: 'moderation',
  defaults: {
    collectionModerators: {
      data: [],
      isLoading: false,
      error: null,
      searchValue: null,
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
export class ModerationState {
  private readonly moderationService = inject(ModerationService);

  @Action(LoadCollectionModerators)
  loadCollectionModerators(ctx: StateContext<ModerationStateModel>, action: LoadCollectionModerators) {
    const state = ctx.getState();

    ctx.patchState({
      collectionModerators: { ...state.collectionModerators, isLoading: true, error: null },
    });

    return this.moderationService.getCollectionModerators(action.collectionId).pipe(
      tap((moderators: ModeratorModel[]) => {
        ctx.patchState({
          collectionModerators: {
            ...state.collectionModerators,
            data: moderators,
            isLoading: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'collectionModerators', error))
    );
  }

  @Action(UpdateCollectionSearchValue)
  updateSearchValue(ctx: StateContext<ModerationStateModel>, action: UpdateCollectionSearchValue) {
    ctx.patchState({
      collectionModerators: { ...ctx.getState().collectionModerators, searchValue: action.searchValue },
    });
  }

  @Action(AddCollectionModerator)
  addCollectionModerator(ctx: StateContext<ModerationStateModel>, action: AddCollectionModerator) {
    const state = ctx.getState();

    ctx.patchState({
      collectionModerators: { ...state.collectionModerators, isLoading: true, error: null },
    });

    return this.moderationService.addCollectionModerator(action.collectionId, action.moderator).pipe(
      tap((moderator) => {
        const currentState = ctx.getState();

        ctx.patchState({
          collectionModerators: {
            ...currentState.collectionModerators,
            data: [...currentState.collectionModerators.data, moderator],
            isLoading: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'collectionModerators', error))
    );
  }

  @Action(UpdateCollectionModerator)
  updateCollectionModerator(ctx: StateContext<ModerationStateModel>, action: UpdateCollectionModerator) {
    const state = ctx.getState();

    ctx.patchState({
      collectionModerators: { ...state.collectionModerators, isLoading: true, error: null },
    });

    return this.moderationService.updateCollectionModerator(action.collectionId, action.moderator).pipe(
      tap((updatedModerator) => {
        const currentState = ctx.getState();

        ctx.patchState({
          collectionModerators: {
            ...currentState.collectionModerators,
            data: currentState.collectionModerators.data.map((moderator) =>
              moderator.id === updatedModerator.id ? updatedModerator : moderator
            ),
            isLoading: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'collectionModerators', error))
    );
  }

  @Action(DeleteCollectionModerator)
  deleteCollectionModerator(ctx: StateContext<ModerationStateModel>, action: DeleteCollectionModerator) {
    const state = ctx.getState();

    ctx.patchState({
      collectionModerators: { ...state.collectionModerators, isLoading: true, error: null },
    });

    return this.moderationService.deleteCollectionModerator(action.collectionId, action.moderatorId).pipe(
      tap(() => {
        ctx.patchState({
          collectionModerators: {
            ...state.collectionModerators,
            data: state.collectionModerators.data.filter((moderator) => moderator.userId !== action.moderatorId),
            isLoading: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'collectionModerators', error))
    );
  }

  @Action(SearchUsers)
  searchUsers(ctx: StateContext<ModerationStateModel>, action: SearchUsers) {
    const state = ctx.getState();

    ctx.patchState({
      users: { ...state.users, isLoading: true, error: null },
    });

    const addedModeratorsIds = state.collectionModerators.data.map((moderator) => moderator.userId);

    if (!action.searchValue) {
      return of([]);
    }

    return this.moderationService.searchUsers(action.searchValue, action.page).pipe(
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
      catchError((error) => this.handleError(ctx, 'users', error))
    );
  }

  @Action(ClearUsers)
  clearUsers(ctx: StateContext<ModerationStateModel>) {
    ctx.patchState({ users: { data: [], isLoading: false, error: null, totalCount: 0 } });
  }

  private handleError(ctx: StateContext<ModerationStateModel>, key: keyof ModerationStateModel, error: Error) {
    const state = ctx.getState();
    ctx.patchState({
      [key]: {
        ...state[key],
        isLoading: false,
        error: error.message,
      },
    });
    return throwError(() => error);
  }
}
