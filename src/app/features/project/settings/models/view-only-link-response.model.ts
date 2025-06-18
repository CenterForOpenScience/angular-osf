import { UserGetResponse } from '@osf/core/models';

export interface ViewOnlyLinksResponseModel {
  data: ViewOnlyLink[];
  links: PaginationLinks;
  meta: {
    version: string;
  };
}

export interface ViewOnlyLink {
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
        related: LinkWithMeta;
      };
      data: {
        id: string;
        type: 'users';
      };
    };
    nodes: {
      links: {
        related: LinkWithMeta;
        self: LinkWithMeta;
      };
    };
  };
  links: {
    self: string;
  };
}

export interface LinkWithMeta {
  href: string;
  meta: Record<string, unknown>;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
  meta: {
    total: number;
    per_page: number;
  };
}
