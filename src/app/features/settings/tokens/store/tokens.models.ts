import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

import { ScopeModel, TokenModel } from '../models';

export interface TokensStateModel {
  scopes: AsyncStateModel<ScopeModel[]>;
  tokens: AsyncStateModel<TokenModel[]>;
}

export const TOKENS_STATE_DEFAULTS: TokensStateModel = {
  scopes: {
    data: [],
    isLoading: false,
    error: null,
  },
  tokens: {
    data: [],
    isLoading: false,
    error: null,
  },
};
