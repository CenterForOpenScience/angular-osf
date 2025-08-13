import { RegistryResourceType } from '@shared/enums';
import { ApiData, JsonApiResponse } from '@shared/models';

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
