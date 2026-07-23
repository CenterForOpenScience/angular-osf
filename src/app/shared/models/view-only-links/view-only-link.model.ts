import { CreatorModel } from '../user/creator.model';

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
  creator: CreatorModel;
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
