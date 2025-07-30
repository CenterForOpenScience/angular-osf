import { LinkedNode, LinkedRegistration } from './linked-nodes.models';

export interface LinkedNodesResponseJsonApi {
  data: LinkedNode[];
  meta: {
    total: number;
    per_page: number;
  };
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
  meta: {
    total: number;
    per_page: number;
  };
  links: {
    self: string;
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}
