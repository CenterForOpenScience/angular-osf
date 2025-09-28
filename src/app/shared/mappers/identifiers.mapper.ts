import { Identifier, IdentifiersJsonApiData, ResponseJsonApi } from '@shared/models';

export class IdentifiersMapper {
  static fromJsonApi(response: ResponseJsonApi<IdentifiersJsonApiData[]>): Identifier[] {
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
