import { Selector } from '@ngxs/store';

import { ScopeModel, TokenModel } from '../models';

import { TokensStateModel } from './tokens.models';
import { TokensState } from './tokens.state';

export class TokensSelectors {
  @Selector([TokensState])
  static getScopes(state: TokensStateModel): ScopeModel[] {
    return state.scopes.data;
  }

  @Selector([TokensState])
  static getTokens(state: TokensStateModel): TokenModel[] {
    return state.tokens.data;
  }

  @Selector([TokensState])
  static isTokensLoading(state: TokensStateModel) {
    return state.tokens.isLoading;
  }

  @Selector([TokensState])
  static getTokenById(state: TokensStateModel) {
    return (id: string | null) => state.tokens.data.find((token) => token.id === id);
  }
}
