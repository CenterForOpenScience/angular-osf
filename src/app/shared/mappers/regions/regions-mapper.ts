import { IdNameModel } from '@osf/shared/models/common/id-name.model';
import { RegionDataJsonApi, RegionsResponseJsonApi } from '@osf/shared/models/regions/regions.json-api.model';

export class RegionsMapper {
  static fromRegionsResponseJsonApi(response: RegionsResponseJsonApi): IdNameModel[] {
    return response.data.map((data) => ({
      id: data.id,
      name: data.attributes.name,
    }));
  }

  static getRegion(data: RegionDataJsonApi): IdNameModel {
    return {
      id: data.id,
      name: data.attributes.name,
    };
  }
}
