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
    creator: {
      data: {
        attributes: {
          full_name: string;
        };
      };
    };
  };
  relationships: {
    collection: {
      date: {
        id: string;
        type: 'collections';
      };
    };
    target: {
      data: {
        id: string;
        type: 'collection-submission';
      };
    };
    creator: {
      data: {
        id: string;
        type: 'users';
      };
    };
  };
}
