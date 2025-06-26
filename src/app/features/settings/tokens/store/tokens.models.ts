import { AsyncStateModel } from '@osf/shared/models';

import { ScopeModel, TokenModel } from '../models';

export interface TokensStateModel {
  scopes: AsyncStateModel<ScopeModel[]>;
  tokens: AsyncStateModel<TokenModel[]>;
}
