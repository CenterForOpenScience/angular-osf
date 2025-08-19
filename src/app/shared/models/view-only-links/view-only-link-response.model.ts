import { MetaJsonApi } from '../common';
import { UserGetResponse } from '../user';

export interface ViewOnlyLinksResponseJsonApi {
  data: ViewOnlyLinkJsonApi[];
  links: PaginationLinksJsonApi;
  meta: MetaJsonApi;
}

export interface ViewOnlyLinkJsonApi {
  id: string;
  type: 'view_only_links';
  attributes: {
    key: string;
    date_created: string;
    anonymous: boolean;
    name: string;
  };
  embeds: {
    creator: {
      data: UserGetResponse;
    };
  };
  relationships: {
    creator: {
      links: {
        related: LinkWithMetaJsonApi;
      };
      data: {
        id: string;
        type: 'users';
      };
    };
    nodes: {
      links: {
        related: LinkWithMetaJsonApi;
        self: LinkWithMetaJsonApi;
      };
    };
  };
  links: {
    self: string;
  };
}

export interface LinkWithMetaJsonApi {
  href: string;
  meta: Record<string, unknown>;
}

interface PaginationLinksJsonApi {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}
