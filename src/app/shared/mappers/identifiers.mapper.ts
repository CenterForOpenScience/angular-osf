import { IdentifierModel } from '../models/identifiers/identifier.model';
import { IdentifiersResponseJsonApi } from '../models/identifiers/identifier-json-api.model';

export class IdentifiersMapper {
  static fromJsonApi(response: IdentifiersResponseJsonApi | undefined): IdentifierModel[] {
    if (!response || !response.data) {
      return [];
    }

    return response?.data.map((rawIdentifier) => ({
      id: rawIdentifier.id,
      type: rawIdentifier.type,
      category: rawIdentifier.attributes.category,
      value: rawIdentifier.attributes.value,
    }));
  }
}
