export interface ViewOnlyLinkCreatorModel {
  fullName: string;
  url: string;
}

export interface ViewOnlyLinkNodeModel {
  title: string;
  url: string;
  scale: string;
  category: string;
  id?: string;
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

export interface PaginatedViewOnlyLinksModel {
  items: ViewOnlyLinkModel[];
  total: number;
  perPage: number;
  next?: string | null;
  prev?: string | null;
}
