import { UserDataErrorResponseJsonApi } from '@osf/shared/models/user/user-json-api.model';

export interface CollectionSubmissionReviewActionJsonApi {
  id: string;
  type: 'collection-submission-actions';
  attributes: {
    trigger: string;
    comment: string;
    from_state: string;
    to_state: string;
    date_created: string;
    date_modified: string;
  };
  embeds: {
    creator: UserDataErrorResponseJsonApi;
  };
  relationships: {
    target: {
      data: {
        id: string;
        type: 'collection-submission';
      };
    };
  };
}
