import { ToOneRelData } from '@osf/shared/models/common/json-api/relationships.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ListResponse } from '@osf/shared/models/common/json-api/responses.model';
import { UserDataErrorResponseJsonApi } from '@osf/shared/models/user/user-json-api.model';

export type CollectionSubmissionReviewActionsListResponseJsonApi =
  ListResponse<CollectionSubmissionReviewActionJsonApi>;

export interface CollectionSubmissionReviewActionJsonApi extends JsonApiResource<
  'collection-submission-actions',
  CollectionSubmissionReviewActionAttributesJsonApi
> {
  embeds: CollectionSubmissionReviewActionEmbedsJsonApi;
  relationships: CollectionSubmissionReviewActionRelationshipsJsonApi;
}

interface CollectionSubmissionReviewActionAttributesJsonApi {
  comment: string;
  date_created: string;
  date_modified: string;
  from_state: string;
  to_state: string;
  trigger: string;
}

interface CollectionSubmissionReviewActionEmbedsJsonApi {
  creator: UserDataErrorResponseJsonApi;
}

interface CollectionSubmissionReviewActionRelationshipsJsonApi {
  target: ToOneRelData<'collection-submission'>;
}
