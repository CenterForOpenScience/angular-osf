export interface Addon {
  id: string;
  type: string;
  attributes: {
    name: string;
    categories: string[];
    url?: string;
    description?: string;
  };
  links: Record<string, unknown>;
}
