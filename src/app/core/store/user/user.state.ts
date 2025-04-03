import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { UserStateModel } from './user.models';
import { GetCurrentUser, SetCurrentUser } from './user.actions';
import { UserService } from '@core/services/user/user.service';
import { tap } from 'rxjs';
import { User } from '@core/services/user/user.entity';

@State<UserStateModel>({
  name: 'user',
  defaults: {
    currentUser: null,
  },
})
@Injectable()
export class UserState {
  private userService = inject(UserService);

  @Selector([UserState])
  static getCurrentUser(state: UserStateModel): User | null {
    return state.currentUser;
  }

  @Action(GetCurrentUser)
  getCurrentUser(ctx: StateContext<UserStateModel>) {
    return this.userService.getCurrentUser().pipe(
      tap((user) => {
        ctx.dispatch(new SetCurrentUser(user));
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
