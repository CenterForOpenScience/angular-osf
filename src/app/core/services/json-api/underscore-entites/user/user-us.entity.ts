export interface UserUS {
  id: string;
  type: string;
  attributes: {
    full_name: string;
    given_name: string;
    family_name: string;
    email: string;
  };
  relationships: Record<string, unknown>;
  links: Record<string, string>;
}
