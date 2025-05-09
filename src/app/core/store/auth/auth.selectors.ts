import { Selector } from '@ngxs/store';

import { AuthStateModel } from './auth.model';
import { AuthState } from './auth.state';

export class AuthSelectors {
  @Selector([AuthState])
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  @Selector([AuthState])
  static getAuthToken(state: AuthStateModel): string | null {
    return state.accessToken;
  }
}
