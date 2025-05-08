import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { UserStateModel } from './user.state-model';
import { GetCurrentUser, GetCurrentUserSettings } from './user.actions';
import { UserService } from '@core/services/user/user.service';
import { tap } from 'rxjs';
import { SetupProfileSettings } from '@osf/features/settings/profile-settings/profile-settings.actions';

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
      }),
    );
  }

  @Action(GetCurrentUserSettings)
  getCurrentUserSettings(ctx: StateContext<UserStateModel>) {
    return this.userService.getCurrentUserSettings().pipe(
      tap((userSettings) => {
        ctx.patchState({
          currentUserSettings: userSettings,
        });
      }),
    );
  }
}
