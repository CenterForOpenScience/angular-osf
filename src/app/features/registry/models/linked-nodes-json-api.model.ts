import { MetaJsonApi } from '@osf/shared/models/common/json-api.model';
import { ContributorDataJsonApi } from '@osf/shared/models/contributors/contributor-response-json-api.model';
import { BaseNodeAttributesJsonApi } from '@osf/shared/models/nodes/base-node-attributes-json-api.model';

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
