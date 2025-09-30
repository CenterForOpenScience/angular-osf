import { Identifier, IdentifiersResponseJsonApi } from '@shared/models';

export class IdentifiersMapper {
  static fromJsonApi(response: IdentifiersResponseJsonApi): Identifier[] {
    return response?.data.map((rawIdentifier) => {
      return {
        category: rawIdentifier.attributes.category,
        value: rawIdentifier.attributes.value,
        id: rawIdentifier.id,
        type: rawIdentifier.type,
      };
    });
  }
}
