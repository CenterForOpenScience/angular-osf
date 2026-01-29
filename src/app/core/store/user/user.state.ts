import { Action, State, StateContext } from '@ngxs/store';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { StorageService } from '@core/services/storage.service';
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
  private storage = inject(StorageService);

  @Action(GetCurrentUser)
  getCurrentUser(ctx: StateContext<UserStateModel>) {
    const currentUser = this.storage.getItem('currentUser');
    const activeFlags = this.storage.getItem('activeFlags');

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
          this.storage.setItem('currentUser', JSON.stringify(data.currentUser));
        }

        if (data.activeFlags) {
          this.storage.setItem('activeFlags', JSON.stringify(data.activeFlags));
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

    this.storage.setItem('currentUser', JSON.stringify(action.user));
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

        this.storage.setItem('currentUser', JSON.stringify(user));
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

        this.storage.setItem('currentUser', JSON.stringify(user));
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

        this.storage.setItem('currentUser', JSON.stringify(user));
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

        this.storage.setItem('currentUser', JSON.stringify(user));
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
          this.storage.setItem('currentUser', JSON.stringify(response));
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

    this.storage.removeItem('currentUser');
  }
}
