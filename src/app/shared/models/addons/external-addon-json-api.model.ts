import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse, ListResponse } from '../common/json-api/responses.model';

export type AddonGetListResponseJsonApi = ListResponse<AddonGetDataJsonApi>;
export type AddonGetItemResponseJsonApi = ItemResponse<AddonGetDataJsonApi>;

export type AddonGetDataJsonApi = JsonApiResource<string, AddonGetAttributesJsonApi>;

interface AddonGetAttributesJsonApi {
  auth_uri: string;
  configurable_api_root: boolean;
  credentials_format: string;
  display_name: string;
  external_service_name: string;
  icon_url: string;
  redirect_url?: string;
  supported_features: string[];
  supported_resource_types?: string[];
  wb_key: string;
  [key: string]: unknown;
}
