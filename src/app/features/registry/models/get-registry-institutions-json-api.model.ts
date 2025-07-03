import { ApiData, JsonApiResponse } from '@core/models';

export type GetRegistryInstitutionsJsonApi = JsonApiResponse<
  ApiData<RegistryInstitutionsAttributes, null, null, null>[],
  null
>;

export interface RegistryInstitutionsAttributes {
  assets: {
    banner: string;
    logo: string;
    logo_rounded: string;
  };
}
