import { ApiData, JsonApiResponse } from '../common/json-api.model';

export type UserRelatedCountsResponseJsonApi = JsonApiResponse<
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
