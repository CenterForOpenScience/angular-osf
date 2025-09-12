import { IdName, RegionsResponseJsonApi } from '@osf/shared/models';

export class RegionsMapper {
  static fromRegionsResponseJsonApi(response: RegionsResponseJsonApi): IdName[] {
    return response.data.map((data) => ({
      id: data.id,
      name: data.attributes.name,
    }));
  }
}
