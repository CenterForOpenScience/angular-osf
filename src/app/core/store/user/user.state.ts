import { Action, State, StateContext } from '@ngxs/store';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { UserService } from '@core/services/user/user.service';
import { SetupProfileSettings } from '@osf/features/settings/profile-settings/profile-settings.actions';

import { GetCurrentUser, GetCurrentUserSettings, SetCurrentUser, UpdateUserSettings } from './user.actions';
import { UserStateModel } from './user.state-model';

@State<UserStateModel>({
  name: 'user',
  defaults: {
    currentUser: null,
    currentUserSettings: null,
  },
})
@Injectable()
export class UserState {
  private userService = inject(UserService);

  @Action(GetCurrentUser)
  getCurrentUser(ctx: StateContext<UserStateModel>) {
    return this.userService.getCurrentUser().pipe(
      tap((user) => {
        ctx.patchState({
          currentUser: user,
        });
        ctx.dispatch(new SetupProfileSettings());
      })
    );
  }

  @Action(SetCurrentUser)
  setCurrentUser(ctx: StateContext<UserStateModel>, action: SetCurrentUser) {
    ctx.patchState({
      currentUser: action.user,
    });
  }

  @Action(GetCurrentUserSettings)
  getCurrentUserSettings(ctx: StateContext<UserStateModel>) {
    return this.userService.getCurrentUserSettings().pipe(
      tap((userSettings) => {
        ctx.patchState({
          currentUserSettings: userSettings,
        });
      })
    );
  }

  @Action(UpdateUserSettings)
  updateUserSettings(ctx: StateContext<UserStateModel>, action: UpdateUserSettings) {
    return this.userService.updateUserSettings(action.userId, action.updatedUserSettings).pipe(
      tap(() => {
        ctx.patchState({
          currentUserSettings: action.updatedUserSettings,
        });
      })
    );
  }
}
