import { Selector } from '@ngxs/store';

import { Scope, Token } from '../models';

import { TokensStateModel } from './tokens.models';
import { TokensState } from './tokens.state';

export class TokensSelectors {
  @Selector([TokensState])
  static getScopes(state: TokensStateModel): Scope[] {
    return state.scopes;
  }

  @Selector([TokensState])
  static getTokens(state: TokensStateModel): Token[] {
    return state.tokens;
  }

  @Selector([TokensState])
  static getTokenById(state: TokensStateModel): (id: string) => Token | undefined {
    return (id: string) => state.tokens.find((token) => token.id === id);
  }
}
