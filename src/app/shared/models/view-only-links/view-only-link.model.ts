export interface ViewOnlyLinkCreatorModel {
  id: string;
  fullName: string;
}

export interface ViewOnlyLinkNodeModel {
  id: string;
  title: string;
  category: string;
}

export interface ViewOnlyLinkModel {
  id: string;
  dateCreated: string;
  key: string;
  name: string;
  link: string;
  creator: ViewOnlyLinkCreatorModel;
  nodes: ViewOnlyLinkNodeModel[];
  anonymous: boolean;
}

export interface ViewOnlyLinkChildren {
  id: string;
  title: string;
  isCurrentResource: boolean;
}

export interface PaginatedViewOnlyLinksModel {
  items: ViewOnlyLinkModel[];
  total: number;
  perPage: number;
  next?: string | null;
  prev?: string | null;
}
