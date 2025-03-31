import { inject, Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Scope, TokensStateModel } from './tokens.models';
import { TokensService } from '@osf/features/settings/tokens/tokens.service';
import { GetScopes } from './tokens.actions';
import { tap } from 'rxjs';

@State<TokensStateModel>({
  name: 'tokens',
  defaults: {
    scopes: [],
    tokens: [],
  },
})
@Injectable()
export class TokensState {
  tokensService = inject(TokensService);

  @Selector()
  static getScopes(state: TokensStateModel): Scope[] {
    return state.scopes;
  }

  @Action(GetScopes)
  getScopes(ctx: StateContext<TokensStateModel>) {
    return this.tokensService.getScopes().pipe(
      tap((scopes) => {
        ctx.patchState({ scopes });
      }),
    );
  }
}
