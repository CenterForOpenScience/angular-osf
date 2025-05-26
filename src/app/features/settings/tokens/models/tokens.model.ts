// API Request Model
export interface TokenCreateRequest {
  data: {
    attributes: {
      name: string;
      scopes: string;
    };
    type: 'tokens';
  };
}

// API Response Model
export interface TokenCreateResponse {
  id: string;
  type: 'tokens';
  attributes: {
    name: string;
    token_id: string;
    scopes: string;
    owner: string;
  };
}

// API Response Model for GET request
export interface TokenGetResponse {
  id: string;
  type: 'tokens';
  attributes: {
    name: string;
    scopes: string;
    owner: string;
  };
}

// Domain Models
export interface Token {
  id: string;
  name: string;
  tokenId: string;
  scopes: string[];
  ownerId: string;
}
