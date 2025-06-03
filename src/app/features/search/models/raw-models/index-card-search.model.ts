import { ApiData, JsonApiResponse } from '@osf/core/models';

import { ResourceItem } from './resource-response.model';

export type IndexCardSearch = JsonApiResponse<
  {
    attributes: { totalResultCount: number };
    relationships: {
      searchResultPage: {
        links: {
          first: {
            href: string;
          };
          next: {
            href: string;
          };
          prev: {
            href: string;
          };
        };
      };
    };
  },
  ApiData<{ resourceMetadata: ResourceItem }, null, null, null>[]
>;
