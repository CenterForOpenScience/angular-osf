import { ReviewPermissions } from '@osf/shared/enums';
import { Brand } from '@shared/models';

export interface RegistryProviderDetails {
  id: string;
  name: string;
  descriptionHtml: string;
  permissions: ReviewPermissions[];
  brand: Brand | null;
  iri: string;
  reviewsWorkflow: string;
}
