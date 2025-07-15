import { ApiData, JsonApiResponse } from '@core/models';

export type GetConfiguredStorageAddonsJsonApi = JsonApiResponse<
  ApiData<
    {
      display_name: string;
      external_service_name: string;
    },
    null,
    null,
    null
  >[],
  null
>;
