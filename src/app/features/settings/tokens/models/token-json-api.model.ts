export interface TokenCreateRequestJsonApi {
  data: {
    attributes: {
      name: string;
      scopes: string;
    };
    type: 'tokens';
  };
}

export interface TokenGetResponseJsonApi {
  id: string;
  attributes: TokenAttributesJsonApi;
  embeds: TokenEmbedsJsonApi;
}

interface TokenAttributesJsonApi {
  name: string;
}

interface TokenEmbedsJsonApi {
  scopes: {
    data: TokenEmbedsDataItemJsonApi[];
  };
}

interface TokenEmbedsDataItemJsonApi {
  id: string;
}
