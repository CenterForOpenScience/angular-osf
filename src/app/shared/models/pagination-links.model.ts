export interface PaginationLinksModel {
  first?: LinkModel;
  next?: LinkModel;
  prev?: LinkModel;
}

export interface LinkModel {
  href: string;
}
