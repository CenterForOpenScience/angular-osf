import { MetaJsonApi } from '../common';
import { UserDataJsonApi } from '../user';
import { BaseNodeDataJsonApi } from '../nodes';

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
      data: UserDataJsonApi;
    };
    nodes: {
      data: BaseNodeDataJsonApi[];
    };
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
