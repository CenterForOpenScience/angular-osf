import { ApiData, JsonApiResponse } from '@core/models';
import { RegistryResourceType } from '@shared/enums';

export type GetRegistryResourcesJsonApi = JsonApiResponse<RegistryResourceDataJsonApi[], null>;

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
