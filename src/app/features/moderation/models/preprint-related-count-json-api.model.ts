import { PreprintProviderAttributesJsonApi } from '@osf/shared/models';

export interface PreprintRelatedCountJsonApi {
  id: string;
  attributes: PreprintProviderAttributesJsonApi;
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
