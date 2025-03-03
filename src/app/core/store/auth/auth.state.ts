import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { AuthStateModel } from './auth.model';
import { SetAuthToken, ClearAuth } from './auth.actions';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    accessToken: null,
    isAuthenticated: false,
  },
})
@Injectable()
export class AuthState {
  @Action(SetAuthToken)
  setAuthToken(ctx: StateContext<AuthStateModel>, action: SetAuthToken) {
    ctx.patchState({
      accessToken: action.accessToken,
      isAuthenticated: true,
    });
  }

  @Action(ClearAuth)
  clearAuth(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      accessToken: null,
      isAuthenticated: false,
    });
  }
}
