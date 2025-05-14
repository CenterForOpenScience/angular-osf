import { ApiData, JsonApiResponse } from '@core/services/json-api/json-api.entity';

export type UserCountsResponse = JsonApiResponse<
  ApiData<
    {
      employment: { institution: string }[];
      education: { institution: string }[];
    },
    null,
    {
      registrations: {
        links: {
          related: {
            meta: {
              count: number;
            };
          };
        };
      };
      preprints: {
        links: {
          related: {
            meta: {
              count: number;
            };
          };
        };
      };
      nodes: {
        links: {
          related: {
            meta: {
              count: number;
            };
          };
        };
      };
    }
  >,
  null
>;
