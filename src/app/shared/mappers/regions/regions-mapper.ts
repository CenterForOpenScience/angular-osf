import { IdName } from '@osf/shared/models';
import { RegionsResponseJsonApi } from '@osf/shared/models/regions';

export class RegionsMapper {
  static fromRegionsResponseJsonApi(response: RegionsResponseJsonApi): IdName[] {
    return response.data.map((data) => ({
      id: data.id,
      name: data.attributes.name,
    }));
  }
}
