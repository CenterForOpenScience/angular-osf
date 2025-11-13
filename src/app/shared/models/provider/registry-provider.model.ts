import { ReviewPermissions } from '@osf/shared/enums/review-permissions.enum';

import { BrandModel } from '../brand/brand.model';

export interface RegistryProviderDetails {
  id: string;
  name: string;
  descriptionHtml: string;
  permissions: ReviewPermissions[];
  brand: BrandModel | null;
  iri: string;
  reviewsWorkflow: string;
}
