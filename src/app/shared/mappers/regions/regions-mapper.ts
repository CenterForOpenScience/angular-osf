import { IdName } from '@shared/models';
import { RegionsResponseJsonApi } from '@shared/models/regions';

export class RegionsMapper {
  static fromRegionsResponseJsonApi(response: RegionsResponseJsonApi): IdName[] {
    return response.data.map((data) => ({
      id: data.id,
      name: data.attributes.name,
    }));
  }
}
