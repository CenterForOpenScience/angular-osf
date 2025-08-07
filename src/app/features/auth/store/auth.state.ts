import { Action, State, StateContext } from '@ngxs/store';

import { inject, Injectable } from '@angular/core';

import { AuthService } from '@osf/features/auth/services';

import { ForgotPassword, InitializeAuth, Logout, RegisterUser, ResetPassword, SetAuthenticated } from './auth.actions';
import { AuthStateModel } from './auth.model';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    isAuthenticated: false,
  },
})
@Injectable()
export class AuthState {
  private readonly authService = inject(AuthService);

  @Action(InitializeAuth)
  initializeAuth(ctx: StateContext<AuthStateModel>) {
    const isAuthenticated = this.authService.isAuthenticated();
    ctx.patchState({ isAuthenticated });
  }

  @Action(RegisterUser)
  signUp(ctx: StateContext<AuthStateModel>, action: RegisterUser) {
    return this.authService.register(action.payload).subscribe();
  }

  @Action(ForgotPassword)
  forgotPassword(ctx: StateContext<AuthStateModel>, action: ForgotPassword) {
    return this.authService.forgotPassword(action.email).subscribe();
  }

  @Action(ResetPassword)
  resetPassword(ctx: StateContext<AuthStateModel>, { userId, token, newPassword }: ResetPassword) {
    return this.authService.resetPassword(userId, token, newPassword).subscribe();
  }

  @Action(SetAuthenticated)
  setAuthenticated(ctx: StateContext<AuthStateModel>, action: SetAuthenticated) {
    ctx.patchState({ isAuthenticated: action.isAuthenticated });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    this.authService.logout();
    ctx.patchState({ isAuthenticated: false });
  }
}
