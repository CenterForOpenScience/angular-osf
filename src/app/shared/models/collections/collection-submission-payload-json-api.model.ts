import { ToOneRelData } from '../common/json-api/relationships.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { DataResponse } from '../common/json-api/responses.model';

export type CollectionSubmissionPayloadJsonApi = DataResponse<CollectionSubmissionDataJsonApi>;

interface CollectionSubmissionDataJsonApi extends Omit<
  JsonApiResource<'collection-submissions', CollectionSubmissionAttributesJsonApi>,
  'id'
> {
  relationships: CollectionSubmissionRelationshipsJsonApi;
}

interface CollectionSubmissionAttributesJsonApi {
  guid: string;
}

interface CollectionSubmissionRelationshipsJsonApi {
  collection: ToOneRelData<'collections'>;
  creator: ToOneRelData<'users'>;
}
