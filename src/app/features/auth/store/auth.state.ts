import { Action, State, StateContext } from '@ngxs/store';

import { inject, Injectable } from '@angular/core';

import { AuthService } from '@osf/features/auth/services';

import { ForgotPassword, RegisterUser, ResetPassword } from './auth.actions';
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
  private readonly authService = inject(AuthService);

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
}
