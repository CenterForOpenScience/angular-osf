import { Brand } from '@shared/models';

export interface RegistryProviderDetails {
  id: string;
  name: string;
  descriptionHtml: string;
  brand: Brand;
  iri: string;
}
