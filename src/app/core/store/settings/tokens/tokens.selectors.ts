import { Selector } from '@ngxs/store';
import { TokensStateModel } from './tokens.models';
import { Scope } from '@osf/features/settings/tokens/entities/scope.interface';
import { Token } from '@osf/features/settings/tokens/entities/tokens.models';
import { TokensState } from '@core/store/settings';

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
  static getTokenById(
    state: TokensStateModel,
  ): (id: string) => Token | undefined {
    return (id: string) => state.tokens.find((token) => token.id === id);
  }
}
