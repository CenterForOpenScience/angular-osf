import { JsonApiResource } from '../common/json-api/resource.model';
import { ListResponse } from '../common/json-api/responses.model';

export type RegionsResponseJsonApi = ListResponse<RegionDataJsonApi>;

export type RegionDataJsonApi = JsonApiResource<'regions', RegionAttributesJsonApi>;

interface RegionAttributesJsonApi {
  name: string;
}
