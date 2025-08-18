import { ApiData, JsonApiResponse } from '@osf/shared/models/common/json-api.model';

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
    },
    null
  >,
  null
>;
