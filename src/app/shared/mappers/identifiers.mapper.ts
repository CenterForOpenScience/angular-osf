import { Identifier, ResponseJsonApi } from '@shared/models';
import { IdentifiersEmbedJsonApiData } from '@shared/models/identifiers/identifier-json-api';

export class IdentifiersMapper {
  static fromEmbeds(response: ResponseJsonApi<IdentifiersEmbedJsonApiData[]>): Identifier[] {
    return response.data.map((rawIdentifier) => {
      return {
        category: rawIdentifier.attributes.category,
        value: rawIdentifier.attributes.value,
        id: rawIdentifier.id,
        type: rawIdentifier.type,
      };
    });
  }
}
