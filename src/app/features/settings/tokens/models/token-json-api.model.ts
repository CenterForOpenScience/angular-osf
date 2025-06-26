export interface TokenCreateRequestJsonApi {
  data: {
    attributes: {
      name: string;
      scopes: string;
    };
    type: 'tokens';
  };
}

export interface TokenCreateResponseJsonApi {
  id: string;
  type: 'tokens';
  attributes: {
    name: string;
    token_id: string;
    scopes: string;
    owner: string;
  };
}

export interface TokenGetResponseJsonApi {
  id: string;
  type: 'tokens';
  attributes: {
    name: string;
    scopes: string;
    owner: string;
  };
}
