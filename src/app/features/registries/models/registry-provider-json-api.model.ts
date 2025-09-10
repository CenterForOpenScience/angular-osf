import { BrandDataJsonApi, RegistrationProviderAttributesJsonApi } from '@shared/models';

export interface RegistryProviderDetailsJsonApi {
  id: string;
  type: 'registration-providers';
  attributes: RegistrationProviderAttributesJsonApi;
  embeds?: {
    brand: {
      data: BrandDataJsonApi;
    };
  };
  links: {
    iri: string;
  };
}
