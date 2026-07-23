import { RelatedCountRel } from '../common/json-api/relationships.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse } from '../common/json-api/responses.model';
import { UserAttributesJsonApi } from '../user/user-json-api.model';

export type UserRelatedCountsResponseJsonApi = ItemResponse<UserRelatedCountsDataJsonApi>;

export interface UserRelatedCountsDataJsonApi extends JsonApiResource<'users', UserAttributesJsonApi> {
  relationships: UserRelatedCountsRelationshipsJsonApi;
}

interface UserRelatedCountsRelationshipsJsonApi {
  draft_preprints: RelatedCountRel;
  institutions: RelatedCountRel;
  nodes: RelatedCountRel;
  preprints: RelatedCountRel;
  registrations: RelatedCountRel;
}
