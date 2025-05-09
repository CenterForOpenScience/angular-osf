import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { UserStateModel } from './user.models';
import { GetCurrentUser, SetCurrentUser } from './user.actions';
import { UserService } from '@core/services/user/user.service';
import { tap } from 'rxjs';
import { SetupProfileSettings } from '@osf/features/settings/profile-settings/profile-settings.actions';

@State<UserStateModel>({
  name: 'user',
  defaults: {
    currentUser: null,
  },
})
@Injectable()
export class UserState {
  private userService = inject(UserService);

  @Action(GetCurrentUser)
  getCurrentUser(ctx: StateContext<UserStateModel>) {
    return this.userService.getCurrentUser().pipe(
      tap((user) => {
        ctx.dispatch(new SetCurrentUser(user));
        ctx.dispatch(new SetupProfileSettings());
      }),
    );
  }

  @Action(SetCurrentUser)
  setCurrentUser(ctx: StateContext<UserStateModel>, action: SetCurrentUser) {
    ctx.patchState({
      currentUser: action.user,
    });
  }
}
