export interface ResourceLinksJsonApi {
  html: string;
  self: string;
  iri: string;
  redirect_url?: string;
}

export interface PaginationLinks {
  self?: string;
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
}
