import { RegistryResourceType } from '@shared/enums/registry-resource.enum';
import { ApiData, JsonApiResponse } from '@shared/models/common/json-api.model';

export type AddResourceJsonApi = JsonApiResponse<RegistryResourceDataJsonApi, null>;

export type RegistryResourceDataJsonApi = ApiData<
  {
    description: string;
    finalized: true;
    resource_type: RegistryResourceType;
    pid: string;
  },
  null,
  null,
  null
>;
