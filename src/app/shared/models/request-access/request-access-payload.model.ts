import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';

export interface RequestAccessPayload {
  permissions: ContributorPermission;
}
