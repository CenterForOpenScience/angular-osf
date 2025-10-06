import { IdName, RegionDataJsonApi, RegionsResponseJsonApi } from '@osf/shared/models';

export class RegionsMapper {
  static fromRegionsResponseJsonApi(response: RegionsResponseJsonApi): IdName[] {
    return response.data.map((data) => ({
      id: data.id,
      name: data.attributes.name,
    }));
  }

  static getRegion(data: RegionDataJsonApi): IdName {
    return {
      id: data.id,
      name: data.attributes.name,
    };
  }
}
