export interface CollectionSubmissionPayloadJsonApi {
  data: {
    type: 'collection-submissions';
    attributes: {
      guid: string;
    };
    relationships: {
      collection: {
        data: {
          id: string;
          type: 'collections';
        };
      };
      creator: {
        data: {
          type: 'users';
          id: string;
        };
      };
    };
  };
}
