import { BrandDataJsonApi } from '@shared/models';

export interface RegistryProviderDetailsJsonApi {
  id: string;
  type: 'registration-providers';
  attributes: {
    name: string;
    description: string;
  };
  embeds?: {
    brand: {
      data: BrandDataJsonApi;
    };
  };
  links: {
    iri: string;
  };
}
