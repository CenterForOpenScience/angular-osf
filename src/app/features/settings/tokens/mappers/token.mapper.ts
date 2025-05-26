import { Token, TokenCreateRequest, TokenCreateResponse, TokenGetResponse } from '../models';

export class TokenMapper {
  static toRequest(name: string, scopes: string[]): TokenCreateRequest {
    return {
      data: {
        attributes: {
          name,
          scopes: scopes.join(' '),
        },
        type: 'tokens',
      },
    };
  }

  static fromCreateResponse(response: TokenCreateResponse): Token {
    return {
      id: response.id,
      name: response.attributes.name,
      tokenId: response.attributes.token_id,
      scopes: response.attributes.scopes.split(' '),
      ownerId: response.attributes.owner,
    };
  }

  static fromGetResponse(response: TokenGetResponse): Token {
    return {
      id: response.id,
      name: response.attributes.name,
      tokenId: response.id,
      scopes: response.attributes.scopes.split(' '),
      ownerId: response.attributes.owner,
    };
  }
}
