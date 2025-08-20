import { ApiData, JsonApiResponse } from '@osf/shared/models';
import { AppliedFilter, RelatedPropertyPathAttributes } from '@shared/mappers';

import { ResourceItem } from './resource-response.model';

export type IndexCardSearch = JsonApiResponse<
  {
    attributes: {
      totalResultCount: number;
      cardSearchFilter?: AppliedFilter[];
    };
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
  (
    | ApiData<{ resourceMetadata: ResourceItem }, null, null, null>
    | ApiData<RelatedPropertyPathAttributes, null, null, null>
  )[]
>;
