import { TokenCreateRequestJsonApi, TokenCreateResponseJsonApi, TokenGetResponseJsonApi, TokenModel } from '../models';

export class TokenMapper {
  static toRequest(name: string, scopes: string[]): TokenCreateRequestJsonApi {
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

  static fromCreateResponse(response: TokenCreateResponseJsonApi): TokenModel {
    return {
      id: response.id,
      name: response.attributes.name,
      tokenId: response.attributes.token_id,
      scopes: response.attributes.scopes.split(' '),
      ownerId: response.attributes.owner,
    };
  }

  static fromGetResponse(response: TokenGetResponseJsonApi): TokenModel {
    return {
      id: response.id,
      name: response.attributes.name,
      tokenId: response.id,
      scopes: response.attributes.scopes.split(' '),
      ownerId: response.attributes.owner,
    };
  }
}
