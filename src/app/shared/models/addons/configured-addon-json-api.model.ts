import { ResourceLinksJsonApi } from '../common/json-api/links.model';
import { ToOneRelData } from '../common/json-api/relationships.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { DataResponse, ItemResponse, JsonApiResponse } from '../common/json-api/responses.model';

import { IncludedAddonData } from './addon-included-json-api.model';

export type ConfiguredAddonListResponseWithIncludeJsonApi = JsonApiResponse<
  ConfiguredAddonDataJsonApi[],
  IncludedAddonData[]
>;
export type ConfiguredAddonItemResponseJsonApi = ItemResponse<ConfiguredAddonDataJsonApi>;
export type ConfiguredAddonDataListResponseJsonApi = DataResponse<ConfiguredAddonDataJsonApi[]>;

export interface ConfiguredAddonDataJsonApi extends JsonApiResource<string, ConfiguredAddonAttributesJsonApi> {
  relationships: ConfiguredAddonRelationshipsJsonApi;
}

export interface ConfiguredAddonResponseDataJsonApi extends JsonApiResource<string, ConfiguredAddonAttributesJsonApi> {
  links: Pick<ResourceLinksJsonApi, 'self'>;
  relationships: ConfiguredAddonResponseRelationshipsJsonApi;
}

export type ConfiguredAddonRequestJsonApi = DataResponse<ConfiguredAddonRequestDataJsonApi>;

interface ConfiguredAddonRequestDataJsonApi {
  id?: string;
  attributes: ConfiguredAddonRequestAttributesJsonApi;
  relationships: ConfiguredAddonRequestRelationshipsJsonApi;
  type: string;
}

interface ConfiguredAddonAttributesJsonApi {
  connected_capabilities: string[];
  connected_operation_names: string[];
  current_user_is_owner: boolean;
  display_name: string;
  external_service_name: string;
  resource_type?: string;
  root_folder?: string;
  target_id?: string;
  target_url?: string;
}

interface ConfiguredAddonRequestAttributesJsonApi {
  authorized_resource_uri: string;
  connected_capabilities: string[];
  connected_operation_names: string[];
  display_name: string;
  external_service_name: string;
  root_folder?: string | null;
  target_id?: string | null;
  target_url?: string | null;
}

interface ConfiguredAddonRelationshipsJsonApi {
  base_account: ToOneRelData;
  external_citation_service?: ToOneRelData<'external-citation-services'>;
  external_link_service?: ToOneRelData<'external-link-services'>;
  external_storage_service?: ToOneRelData;
}

interface ConfiguredAddonResponseRelationshipsJsonApi {
  base_account: ToOneRelData;
  authorized_resource?: ToOneRelData;
  external_citation_service?: ToOneRelData;
  external_link_service?: ToOneRelData;
  external_storage_service?: ToOneRelData;
}

interface ConfiguredAddonRequestRelationshipsJsonApi {
  account_owner: ToOneRelData;
  authorized_resource?: ToOneRelData;
  base_account: ToOneRelData;
  external_citation_service?: ToOneRelData;
  external_storage_service?: ToOneRelData;
}
