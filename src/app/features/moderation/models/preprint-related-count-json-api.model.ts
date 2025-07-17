export interface PreprintRelatedCountJsonApi {
  id: string;
  attributes: {
    name: string;
    reviews_comments_anonymous: boolean;
    reviews_comments_private: boolean;
    reviews_workflow: boolean;
    email_support?: string;
  };
  relationships: {
    preprints: {
      links: {
        related: {
          meta: {
            accepted: number;
            initial: number;
            pending: number;
            rejected: number;
            withdrawn: number;
          };
        };
      };
    };
  };
}
