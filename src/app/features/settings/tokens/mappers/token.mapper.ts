import {
  Token,
  TokenCreateRequest,
  TokenCreateResponse,
} from '@osf/features/settings/tokens/entities/tokens.models';

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

  static fromResponse(response: TokenCreateResponse): Token {
    const { data } = response;
    return {
      id: data.id,
      name: data.attributes.name,
      tokenId: data.attributes.token_id,
      scopes: data.embeds.scopes.data.map((scope) => scope.id),
      ownerId: data.relationships.owner.data.id,
      htmlUrl: data.links.html,
      apiUrl: data.links.self,
    };
  }
}
