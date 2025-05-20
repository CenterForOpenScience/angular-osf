import { RelatedCountsGetResponse, RelatedCountsModel } from '../models';

export class RelatedCountsMapper {
  static fromResponse(response: RelatedCountsGetResponse): RelatedCountsModel {
    return {
      id: response.data.id,
      forksCount: response.data.relationships.forks.links.related.meta.count,
      linksToCount: response.data.relationships.linked_by_nodes.links.related.meta.count,
      templateCount: response.meta.templated_by_count,
    };
  }
}
