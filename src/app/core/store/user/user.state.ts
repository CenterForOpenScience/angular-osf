import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { removeNullable } from '@osf/shared/constants';
import { ProfileSettingsKey } from '@osf/shared/enums';
import { UserMapper } from '@osf/shared/mappers';
import { Social } from '@osf/shared/models';

import { UserService } from '../../services';

import {
  ClearCurrentUser,
  GetCurrentUser,
  GetCurrentUserSettings,
  SetCurrentUser,
  SetUserAsModerator,
  UpdateProfileSettingsEducation,
  UpdateProfileSettingsEmployment,
  UpdateProfileSettingsSocialLinks,
  UpdateProfileSettingsUser,
  UpdateUserSettings,
} from './user.actions';
import { USER_STATE_INITIAL, UserStateModel } from './user.model';

@State<UserStateModel>({
  name: 'user',
  defaults: USER_STATE_INITIAL,
})
@Injectable()
export class UserState {
  private userService = inject(UserService);

  @Action(GetCurrentUser)
  getCurrentUser(ctx: StateContext<UserStateModel>) {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      const parsedUser = JSON.parse(currentUser);

      ctx.patchState({
        currentUser: {
          data: parsedUser,
          isLoading: false,
          error: null,
        },
      });

      return;
    }

    ctx.patchState({
      currentUser: {
        ...ctx.getState().currentUser,
        isLoading: true,
      },
    });

    return this.userService.getCurrentUser().pipe(
      tap((data) => {
        ctx.patchState({
          currentUser: {
            data: data.currentUser,
            isLoading: false,
            error: null,
          },
          activeFlags: data.activeFlags,
        });

        if (data.currentUser) {
          localStorage.setItem('currentUser', JSON.stringify(data.currentUser));
        }
      })
    );
  }

  @Action(SetCurrentUser)
  setCurrentUser(ctx: StateContext<UserStateModel>, action: SetCurrentUser) {
    ctx.patchState({
      currentUser: {
        data: action.user,
        isLoading: false,
        error: null,
      },
    });

    localStorage.setItem('currentUser', JSON.stringify(action.user));
  }

  @Action(GetCurrentUserSettings)
  getCurrentUserSettings(ctx: StateContext<UserStateModel>) {
    ctx.setState(patch({ currentUserSettings: patch({ isLoading: true }) }));

    return this.userService.getCurrentUserSettings().pipe(
      tap((userSettings) => {
        ctx.setState(
          patch({
            currentUserSettings: patch({
              data: userSettings,
              isLoading: false,
            }),
          })
        );
      })
    );
  }

  @Action(UpdateUserSettings)
  updateUserSettings(ctx: StateContext<UserStateModel>, action: UpdateUserSettings) {
    ctx.setState(patch({ currentUserSettings: patch({ isSubmitting: true }) }));

    return this.userService.updateUserSettings(action.userId, action.updatedUserSettings).pipe(
      tap(() => {
        ctx.setState(
          patch({
            currentUserSettings: patch({
              data: action.updatedUserSettings,
              isSubmitting: false,
            }),
          })
        );
      })
    );
  }

  @Action(UpdateProfileSettingsEmployment)
  updateProfileSettingsEmployment(ctx: StateContext<UserStateModel>, { payload }: UpdateProfileSettingsEmployment) {
    const state = ctx.getState();
    const userId = state.currentUser.data?.id;

    if (!userId) {
      return;
    }

    const withoutNulls = payload.employment.map((item) => removeNullable(item));

    return this.userService.updateUserProfile(userId, ProfileSettingsKey.Employment, withoutNulls).pipe(
      tap((user) => {
        ctx.patchState({
          currentUser: {
            ...state.currentUser,
            data: user,
          },
        });
      })
    );
  }

  @Action(UpdateProfileSettingsEducation)
  updateProfileSettingsEducation(ctx: StateContext<UserStateModel>, { payload }: UpdateProfileSettingsEducation) {
    const state = ctx.getState();
    const userId = state.currentUser.data?.id;

    if (!userId) {
      return;
    }

    const withoutNulls = payload.education.map((item) => removeNullable(item));

    return this.userService.updateUserProfile(userId, ProfileSettingsKey.Education, withoutNulls).pipe(
      tap((user) => {
        ctx.patchState({
          currentUser: {
            ...state.currentUser,
            data: user,
          },
        });
      })
    );
  }

  @Action(UpdateProfileSettingsUser)
  updateProfileSettingsUser(ctx: StateContext<UserStateModel>, { payload }: UpdateProfileSettingsUser) {
    const state = ctx.getState();
    const userId = state.currentUser.data?.id;

    if (!userId) {
      return;
    }

    const withoutNulls = UserMapper.toNamesRequest(removeNullable(payload.user));

    return this.userService.updateUserProfile(userId, ProfileSettingsKey.User, withoutNulls).pipe(
      tap((user) => {
        ctx.patchState({
          currentUser: {
            ...state.currentUser,
            data: user,
          },
        });
      })
    );
  }

  @Action(UpdateProfileSettingsSocialLinks)
  updateProfileSettingsSocialLinks(ctx: StateContext<UserStateModel>, { payload }: UpdateProfileSettingsSocialLinks) {
    const state = ctx.getState();
    const userId = state.currentUser.data?.id;

    if (!userId) {
      return;
    }

    let social = {} as Partial<Social>;

    payload.socialLinks.forEach((item) => {
      social = {
        ...social,
        ...item,
      };
    });

    return this.userService.updateUserProfile(userId, ProfileSettingsKey.Social, social).pipe(
      tap((user) => {
        ctx.patchState({
          currentUser: {
            ...state.currentUser,
            data: user,
          },
        });
      })
    );
  }
  @Action(SetUserAsModerator)
  setUserAsModerator(ctx: StateContext<UserStateModel>) {
    const state = ctx.getState();
    const currentUser = state.currentUser.data;

    if (!currentUser) {
      return;
    }

    ctx.patchState({
      currentUser: {
        ...state.currentUser,
        data: {
          ...currentUser,
          isModerator: true,
        },
      },
    });
  }

  @Action(ClearCurrentUser)
  clearCurrentUser(ctx: StateContext<UserStateModel>) {
    ctx.patchState({
      currentUser: {
        data: null,
        isLoading: false,
        error: null,
      },
      activeFlags: [],
    });

    localStorage.removeItem('currentUser');
  }
}
