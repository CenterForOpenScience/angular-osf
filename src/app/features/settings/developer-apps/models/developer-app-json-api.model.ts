import { StringOrNull } from '@osf/shared/helpers/types.helper';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { DataResponse, ItemResponse, ListResponse } from '@osf/shared/models/common/json-api/responses.model';

export type DeveloperAppsListResponseJsonApi = ListResponse<DeveloperAppDataJsonApi>;
export type DeveloperAppResponseJsonApi = ItemResponse<DeveloperAppDataJsonApi>;

export type DeveloperAppDataJsonApi = JsonApiResource<'applications', DeveloperAppAttributesJsonApi>;

export type DeveloperAppCreateRequestJsonApi = DataResponse<DeveloperAppCreateDataJsonApi>;

export interface DeveloperAppUpdateRequestJsonApi {
  data: DeveloperAppCreateRequestJsonApi['data'] & { id: string };
}

interface DeveloperAppCreateDataJsonApi {
  attributes: DeveloperAppChangeAttributesJsonApi;
  type: 'applications';
}

interface DeveloperAppChangeAttributesJsonApi {
  callback_url: string;
  description: StringOrNull;
  home_url: string;
  name: string;
}

interface DeveloperAppAttributesJsonApi {
  callback_url: string;
  client_id: string;
  client_secret: string;
  description: string;
  home_url: string;
  name: string;
}
