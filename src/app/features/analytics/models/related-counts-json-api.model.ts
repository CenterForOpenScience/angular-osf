import { RelatedCountRel } from '@osf/shared/models/common/json-api/relationships.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse } from '@osf/shared/models/common/json-api/responses.model';
import { BaseNodeAttributesJsonApi } from '@osf/shared/models/nodes/base-node-attributes-json-api.model';

export type RelatedCountsResponseJsonApi = ItemResponse<RelatedCountsDataJsonApi> & {
  meta: RelatedCountsResponseMetaJsonApi;
};

interface RelatedCountsDataJsonApi extends JsonApiResource<'related-counts', BaseNodeAttributesJsonApi> {
  relationships: RelatedCountsRelationshipsJsonApi;
}

interface RelatedCountsRelationshipsJsonApi {
  forks?: RelatedCountRel;
  linked_by_nodes?: RelatedCountRel;
}

interface RelatedCountsResponseMetaJsonApi {
  templated_by_count: number;
}
