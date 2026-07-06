export interface PaginationLinksModel {
  first?: LinkModel;
  next?: LinkModel;
  prev?: LinkModel;
}

interface LinkModel {
  href: string;
}
