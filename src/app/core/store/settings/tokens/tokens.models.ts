export interface Scope {
  id: string;
  type: string;
  attributes: {
    description: string;
  };
  links: {
    self: string;
  };
}

export interface PersonalAccessToken {
  id: string;
  tokenName: string;
  scopes: string[];
}

export interface TokensStateModel {
  scopes: Scope[];
  tokens: PersonalAccessToken[];
}
