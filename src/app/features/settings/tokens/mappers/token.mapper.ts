import { TokenCreateRequestJsonApi, TokenGetResponseJsonApi, TokenModel } from '../models';

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

  static fromGetResponse(response: TokenGetResponseJsonApi): TokenModel {
    return {
      id: response.id,
      tokenId: response.attributes.token_id,
      name: response.attributes.name,
      scopes: response.embeds.scopes.data.map((item) => item.id),
    };
  }
}
