import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { RegistryResourceType } from '@shared/enums/registry-resource.enum';
import { ItemResponse, ListResponse } from '@shared/models/common/json-api/responses.model';

export type GetRegistryResourcesJsonApi = ListResponse<RegistryResourceDataJsonApi>;
export type AddResourceJsonApi = ItemResponse<RegistryResourceDataJsonApi>;

export type RegistryResourceDataJsonApi = JsonApiResource<'resources', RegistryResourceAttributesJsonApi>;

interface RegistryResourceAttributesJsonApi {
  description: string;
  finalized: true;
  pid: string;
  resource_type: RegistryResourceType;
}
