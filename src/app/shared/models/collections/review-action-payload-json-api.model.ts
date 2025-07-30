export interface ReviewActionPayloadJsonApi {
  data: {
    type: 'collection_submission_actions';
    attributes: {
      trigger: string;
      comment: string;
    };
    relationships: {
      target: {
        data: {
          type: 'collection-submissions';
          id: string;
        };
      };
    };
  };
}
