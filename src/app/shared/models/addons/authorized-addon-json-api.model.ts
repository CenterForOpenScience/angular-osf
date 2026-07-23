import { ToOneRelData } from '../common/json-api/relationships.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { DataResponse, JsonApiResponse } from '../common/json-api/responses.model';

import { IncludedAddonData } from './addon-included-json-api.model';

export type AuthorizedAddonResponseJsonApi = JsonApiResponse<AuthorizedAddonDataJsonApi, IncludedAddonData[]>;
export type AuthorizedAddonListResponseJsonApi = JsonApiResponse<AuthorizedAddonDataJsonApi[], IncludedAddonData[]>;

export interface AuthorizedAddonDataJsonApi extends JsonApiResource<string, AuthorizedAddonAttributesJsonApi> {
  relationships: AuthorizedAddonRelationshipsJsonApi;
}

export type AuthorizedAddonRequestJsonApi = DataResponse<AuthorizedAddonRequestDataJsonApi>;

interface AuthorizedAddonRequestDataJsonApi {
  id?: string;
  type: string;
  attributes: AuthorizedAddonRequestAttributesJsonApi;
  relationships: AuthorizedAddonRelationshipsJsonApi;
}

interface AuthorizedAddonRequestAttributesJsonApi {
  api_base_url: string;
  auth_url: string | null;
  authorized_capabilities: string[];
  credentials: Record<string, unknown>;
  credentials_available: boolean;
  display_name: string;
  initiate_oauth: boolean;
}

interface AuthorizedAddonAttributesJsonApi {
  api_base_url: string;
  auth_url: string | null;
  authorized_capabilities: string[];
  authorized_operation_names: string[];
  credentials_available: boolean;
  default_root_folder: string;
  display_name: string;
  oauth_token?: string;
}

interface AuthorizedAddonRelationshipsJsonApi {
  account_owner: ToOneRelData<'user-references'>;
  external_citation_service?: ToOneRelData<'external-citation-services'>;
  external_link_service?: ToOneRelData<'external-link-services'>;
  external_storage_service?: ToOneRelData<'external-storage-services'>;
}
