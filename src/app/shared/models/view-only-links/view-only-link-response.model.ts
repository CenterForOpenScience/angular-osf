import { MetaJsonApi } from '../common';
import { BaseNodeDataJsonApi } from '../nodes';
import { UserDataErrorResponseJsonApi } from '../user';

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
    creator: UserDataErrorResponseJsonApi;
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
