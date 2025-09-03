import { ReviewPermissions } from '@osf/shared/enums';

export interface ProviderModel {
  id: string;
  name: string;
  permissions?: ReviewPermissions[];
}
