import { MetaJsonApi } from '@osf/shared/models/common/json-api.model';

import { LinkedNode, LinkedRegistration } from './linked-nodes.models';

export interface LinkedNodesResponseJsonApi {
  data: LinkedNode[];
  meta: MetaJsonApi;
  links: {
    self: string;
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface LinkedRegistrationsResponseJsonApi {
  data: LinkedRegistration[];
  meta: MetaJsonApi;
  links: {
    self: string;
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}
