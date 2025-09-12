import { ResponseJsonApi } from '../common';

export type RegionsResponseJsonApi = ResponseJsonApi<RegionDataJsonApi[]>;

export interface RegionDataJsonApi {
  id: string;
  type: 'regions';
  attributes: RegionAttributesJsonApi;
  links: RegionLinksJsonApi;
}

export interface RegionAttributesJsonApi {
  name: string;
}

export interface RegionLinksJsonApi {
  self: string;
}
