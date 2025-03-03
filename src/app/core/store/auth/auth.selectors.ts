import { Selector } from '@ngxs/store';
import { AuthState } from './auth.state';
import { AuthStateModel } from './auth.model';

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
