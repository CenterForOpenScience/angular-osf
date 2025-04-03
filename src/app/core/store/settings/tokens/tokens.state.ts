import { inject, Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { TokensStateModel } from './tokens.models';
import { TokensService } from '@osf/features/settings/tokens/tokens.service';
import {
  GetScopes,
  GetTokens,
  UpdateToken,
  DeleteToken,
} from './tokens.actions';
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

  @Action(GetScopes)
  getScopes(ctx: StateContext<TokensStateModel>) {
    return this.tokensService.getScopes().pipe(
      tap((scopes) => {
        ctx.patchState({ scopes });
      }),
    );
  }

  @Action(GetTokens)
  getTokens(ctx: StateContext<TokensStateModel>) {
    return this.tokensService.getTokens().pipe(
      tap((tokens) => {
        ctx.patchState({ tokens });
      }),
    );
  }

  @Action(UpdateToken)
  updateToken(ctx: StateContext<TokensStateModel>, action: UpdateToken) {
    return this.tokensService
      .updateToken(action.tokenId, action.name, action.scopes)
      .pipe(
        tap((updatedToken) => {
          const state = ctx.getState();
          const updatedTokens = state.tokens.map((token) =>
            token.id === action.tokenId ? updatedToken : token,
          );
          ctx.patchState({ tokens: updatedTokens });
        }),
      );
  }

  @Action(DeleteToken)
  deleteToken(ctx: StateContext<TokensStateModel>, action: DeleteToken) {
    return this.tokensService.deleteToken(action.tokenId).pipe(
      tap(() => {
        const state = ctx.getState();
        const updatedTokens = state.tokens.filter(
          (token) => token.id !== action.tokenId,
        );
        ctx.patchState({ tokens: updatedTokens });
      }),
    );
  }
}
