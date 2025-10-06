import { ContributorPermission } from '@osf/shared/enums';

export interface RequestAccessPayload {
  permissions: ContributorPermission;
}
