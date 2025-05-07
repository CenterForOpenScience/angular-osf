import { Scope } from '@osf/features/settings/tokens/entities/scope.interface';
import { Token } from '@osf/features/settings/tokens/entities/tokens.models';

export interface TokensStateModel {
  scopes: Scope[];
  tokens: Token[];
}
