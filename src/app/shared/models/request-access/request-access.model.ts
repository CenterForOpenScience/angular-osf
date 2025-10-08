import { ContributorPermission } from '@osf/shared/enums';

import { UserModel } from '../user';

export interface RequestAccessModel {
  id: string;
  requestType: string;
  machineState: string;
  comment: string;
  created: string;
  modified: string;
  dateLastTransitioned: string;
  requestedPermissions: ContributorPermission;
  creator: UserModel;
  isBibliographic: boolean;
  isCurator: boolean;
}
