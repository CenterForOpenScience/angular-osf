import { RegistryComponentModel } from './registry-components.models';

export interface RegistryComponentJsonApi {
  id: string;
  type: string;
  attributes: {
    title: string;
    description: string;
    category: string;
    date_created: string;
    date_modified: string;
    date_registered: string;
    registration_supplement: string;
    tags: string[];
    public: boolean;
  };
}

export interface RegistryComponentsJsonApiResponse {
  data: RegistryComponentJsonApi[];
  meta: {
    total: number;
    per_page: number;
  };
}

export interface RegistryComponentsResponseJsonApi {
  data: RegistryComponentModel[];
  meta: { total: number; per_page: number };
}
