import { ReviewPermissions } from '@osf/shared/enums/review-permissions.enum';

export interface ProviderModel {
  id: string;
  name: string;
  permissions?: ReviewPermissions[];
}
