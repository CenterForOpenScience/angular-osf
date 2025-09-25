import { BaseNodeAttributesJsonApi, ContributorDataJsonApi, MetaJsonApi } from '@osf/shared/models';

export interface LinkedNodeJsonApi {
  id: string;
  type: 'nodes';
  attributes: BaseNodeAttributesJsonApi;
  embeds: {
    bibliographic_contributors: {
      data: ContributorDataJsonApi[];
    };
  };
  links: {
    html: string;
    self: string;
    iri: string;
  };
}

export interface LinkedNodesJsonApiResponse {
  data: LinkedNodeJsonApi[];
  meta: MetaJsonApi;
  links: {
    self: string;
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}
