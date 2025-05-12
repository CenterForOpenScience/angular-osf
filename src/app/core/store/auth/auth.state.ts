import { Action, State, StateContext } from '@ngxs/store';

import { Injectable } from '@angular/core';

import { ClearAuth, SetAuthToken } from './auth.actions';
import { AuthStateModel } from './auth.model';

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
