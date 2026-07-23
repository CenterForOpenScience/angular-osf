import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse, ListResponse } from '@osf/shared/models/common/json-api/responses.model';
import { PreprintProviderAttributesJsonApi } from '@osf/shared/models/provider/preprints-provider-json-api.model';

export type PreprintRelatedCountListResponseJsonApi = ListResponse<PreprintRelatedCountJsonApi>;
export type PreprintRelatedCountItemResponseJsonApi = ItemResponse<PreprintRelatedCountJsonApi>;

export interface PreprintRelatedCountJsonApi extends JsonApiResource<
  'preprint-providers',
  PreprintProviderAttributesJsonApi
> {
  relationships: PreprintRelatedCountRelationshipsJsonApi;
}

interface PreprintRelatedCountRelationshipsJsonApi {
  preprints: {
    links: {
      related: {
        meta: PreprintRelationshipMetaJsonApi;
      };
    };
  };
}

interface PreprintRelationshipMetaJsonApi {
  accepted: number;
  initial: number;
  pending: number;
  rejected: number;
  withdrawn: number;
}
