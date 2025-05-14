import { ApiData, JsonApiResponse } from '@core/services/json-api/json-api.entity';
import { ResourceItem } from '@osf/features/search/models/raw-models/resource-response.model';

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
  ApiData<{ resourceMetadata: ResourceItem }, null, null>[]
>;
