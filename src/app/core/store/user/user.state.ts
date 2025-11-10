import { Action, State, StateContext } from '@ngxs/store';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { UserService } from '@core/services/user.service';
import { ProfileSettingsKey } from '@osf/shared/enums/profile-settings-key.enum';
import { removeNullable } from '@osf/shared/helpers/remove-nullable.helper';
import { UserMapper } from '@osf/shared/mappers/user';
import { SocialModel } from '@shared/models/user/social.model';
import { UserModel } from '@shared/models/user/user.models';

import {
  AcceptTermsOfServiceByUser,
  ClearCurrentUser,
  GetCurrentUser,
  SetCurrentUser,
  UpdateProfileSettingsEducation,
  UpdateProfileSettingsEmployment,
  UpdateProfileSettingsSocialLinks,
  UpdateProfileSettingsUser,
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
    const activeFlags = localStorage.getItem('activeFlags');
    if (activeFlags) {
      ctx.patchState({
        activeFlags: JSON.parse(activeFlags),
      });
    }

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
        if (data.activeFlags) {
          localStorage.setItem('activeFlags', JSON.stringify(data.activeFlags));
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

  @Action(UpdateProfileSettingsEmployment)
  updateProfileSettingsEmployment(ctx: StateContext<UserStateModel>, { payload }: UpdateProfileSettingsEmployment) {
    const state = ctx.getState();
    const userId = state.currentUser.data?.id;

    if (!userId) {
      return;
    }

    const withoutNulls = payload.map((item) => removeNullable(item));

    return this.userService.updateUserProfile(userId, ProfileSettingsKey.Employment, withoutNulls).pipe(
      tap((user) => {
        ctx.patchState({
          currentUser: {
            ...state.currentUser,
            data: user,
          },
        });

        localStorage.setItem('currentUser', JSON.stringify(user));
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

    const withoutNulls = payload.map((item) => removeNullable(item));

    return this.userService.updateUserProfile(userId, ProfileSettingsKey.Education, withoutNulls).pipe(
      tap((user) => {
        ctx.patchState({
          currentUser: {
            ...state.currentUser,
            data: user,
          },
        });

        localStorage.setItem('currentUser', JSON.stringify(user));
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

    const withoutNulls = UserMapper.toNamesRequest(removeNullable(payload));

    return this.userService.updateUserProfile(userId, ProfileSettingsKey.User, withoutNulls).pipe(
      tap((user) => {
        ctx.patchState({
          currentUser: {
            ...state.currentUser,
            data: user,
          },
        });

        localStorage.setItem('currentUser', JSON.stringify(user));
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

    let social = {} as Partial<SocialModel>;

    payload.forEach((item) => {
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

        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  @Action(AcceptTermsOfServiceByUser)
  acceptTermsOfServiceByUser(ctx: StateContext<UserStateModel>) {
    const state = ctx.getState();
    const currentUser = state.currentUser.data;

    if (!currentUser) {
      return;
    }

    const updatePayload: Partial<UserModel> = {
      acceptedTermsOfService: true,
    };
    const apiRequest = UserMapper.toAcceptedTermsOfServiceRequest(updatePayload);

    return this.userService.updateUserAcceptedTermsOfService(currentUser.id, apiRequest).pipe(
      tap((response: UserModel): void => {
        if (response.acceptedTermsOfService) {
          ctx.patchState({
            currentUser: {
              ...state.currentUser,
              data: {
                ...currentUser,
                acceptedTermsOfService: true,
              },
            },
          });
          localStorage.setItem('currentUser', JSON.stringify(response));
        }
      })
    );
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
