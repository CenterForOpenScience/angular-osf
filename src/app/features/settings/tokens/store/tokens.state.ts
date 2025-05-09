import { Action, State, StateContext, Store } from '@ngxs/store';

import { of, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { Token } from '@osf/features/settings/tokens/entities/tokens.models';
import { TokensService } from '@osf/features/settings/tokens/tokens.service';

import {
  CreateToken,
  DeleteToken,
  GetScopes,
  GetTokenById,
  GetTokens,
  UpdateToken,
} from './tokens.actions';
import { TokensStateModel } from './tokens.models';

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
  store = inject(Store);

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

  @Action(GetTokenById)
  getTokenById(ctx: StateContext<TokensStateModel>, action: GetTokenById) {
    const state = ctx.getState();
    const tokenFromState = state.tokens.find(
      (token: Token) => token.id === action.tokenId,
    );

    if (tokenFromState) {
      return of(tokenFromState);
    }

    return this.tokensService.getTokenById(action.tokenId).pipe(
      tap((token) => {
        const updatedTokens = [...state.tokens, token];
        ctx.patchState({ tokens: updatedTokens });
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
          const updatedTokens = state.tokens.map((token: Token) =>
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
          (token: Token) => token.id !== action.tokenId,
        );
        ctx.patchState({ tokens: updatedTokens });
      }),
    );
  }

  @Action(CreateToken)
  createToken(ctx: StateContext<TokensStateModel>, action: CreateToken) {
    return this.tokensService.createToken(action.name, action.scopes).pipe(
      tap((newToken) => {
        const state = ctx.getState();
        const updatedTokens = [newToken, ...state.tokens];
        ctx.patchState({ tokens: updatedTokens });

        return newToken;
      }),
    );
  }
}
