import { MetaJsonApi } from '../common/json-api.model';
import { BaseNodeDataJsonApi } from '../nodes/base-node-data-json-api.model';
import { UserDataErrorResponseJsonApi } from '../user/user-json-api.model';

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
