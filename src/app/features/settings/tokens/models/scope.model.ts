export interface Scope {
  id: string;
  type: string;
  attributes: {
    description: string;
  };
  links: {
    self: string;
  };
}
