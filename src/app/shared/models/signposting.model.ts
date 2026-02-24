export const LINKSET_TYPE = 'application/linkset';
export const LINKSET_JSON_TYPE = 'application/linkset+json';

export interface SignpostingLink {
  rel: string;
  href: string;
  type: string;
}
