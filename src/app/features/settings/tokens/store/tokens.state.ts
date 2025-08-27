import { Action, State, StateContext } from '@ngxs/store';

import { catchError, of, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';

import { TokenModel } from '../models';
import { TokensService } from '../services';

import { CreateToken, DeleteToken, GetScopes, GetTokenById, GetTokens, UpdateToken } from './tokens.actions';
import { TOKENS_STATE_DEFAULTS, TokensStateModel } from './tokens.models';

@State<TokensStateModel>({
  name: 'tokens',
  defaults: TOKENS_STATE_DEFAULTS,
})
@Injectable()
export class TokensState {
  private readonly tokensService = inject(TokensService);

  @Action(GetScopes)
  getScopes(ctx: StateContext<TokensStateModel>) {
    const state = ctx.getState();

    ctx.patchState({ scopes: { ...state.scopes, isLoading: true, error: null } });

    return this.tokensService.getScopes().pipe(
      tap((scopes) => {
        ctx.patchState({ scopes: { data: scopes, isLoading: false, error: null } });
      }),
      catchError((error) => handleSectionError(ctx, 'scopes', error))
    );
  }

  @Action(GetTokens)
  getTokens(ctx: StateContext<TokensStateModel>) {
    ctx.patchState({ tokens: { data: [], isLoading: true, error: null } });

    return this.tokensService.getTokens().pipe(
      tap((tokens) => {
        ctx.patchState({ tokens: { data: tokens, isLoading: false, error: null } });
      }),
      catchError((error) => handleSectionError(ctx, 'tokens', error))
    );
  }

  @Action(GetTokenById)
  getTokenById(ctx: StateContext<TokensStateModel>, action: GetTokenById) {
    const state = ctx.getState();
    const tokenFromState = state.tokens.data.find((token: TokenModel) => token.id === action.tokenId);

    if (tokenFromState) {
      return of(tokenFromState);
    }

    ctx.patchState({ tokens: { ...state.tokens, isLoading: true, error: null } });

    return this.tokensService.getTokenById(action.tokenId).pipe(
      tap((token) => {
        const updatedTokens = [...state.tokens.data, token];
        ctx.patchState({ tokens: { data: updatedTokens, isLoading: false, error: null } });
      }),
      catchError((error) => handleSectionError(ctx, 'tokens', error))
    );
  }

  @Action(CreateToken)
  createToken(ctx: StateContext<TokensStateModel>, action: CreateToken) {
    const state = ctx.getState();
    ctx.patchState({ tokens: { ...state.tokens, isLoading: true, error: null } });

    return this.tokensService.createToken(action.name, action.scopes).pipe(
      tap((newToken) => {
        const state = ctx.getState();
        const updatedTokens = [newToken, ...state.tokens.data];
        ctx.patchState({ tokens: { data: updatedTokens, isLoading: false, error: null } });
      }),
      catchError((error) => handleSectionError(ctx, 'tokens', error))
    );
  }

  @Action(UpdateToken)
  updateToken(ctx: StateContext<TokensStateModel>, action: UpdateToken) {
    const state = ctx.getState();
    ctx.patchState({ tokens: { ...state.tokens, isLoading: true, error: null } });

    return this.tokensService.updateToken(action.tokenId, action.name, action.scopes).pipe(
      tap((updatedToken) => {
        const state = ctx.getState();
        const updatedTokens = state.tokens.data.map((token: TokenModel) =>
          token.id === action.tokenId ? updatedToken : token
        );
        ctx.patchState({ tokens: { data: updatedTokens, isLoading: false, error: null } });
      }),
      catchError((error) => handleSectionError(ctx, 'tokens', error))
    );
  }

  @Action(DeleteToken)
  deleteToken(ctx: StateContext<TokensStateModel>, action: DeleteToken) {
    const state = ctx.getState();
    ctx.patchState({ tokens: { ...state.tokens, isLoading: true, error: null } });

    return this.tokensService.deleteToken(action.tokenId).pipe(
      tap(() => {
        const state = ctx.getState();
        const updatedTokens = state.tokens.data.filter((token: TokenModel) => token.id !== action.tokenId);
        ctx.patchState({ tokens: { data: updatedTokens, isLoading: false, error: null } });
      }),
      catchError((error) => handleSectionError(ctx, 'tokens', error))
    );
  }
}
