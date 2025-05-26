import { Scope, Token } from '../models';

export interface TokensStateModel {
  scopes: Scope[];
  tokens: Token[];
}
