import { UserModel } from '../user';

export interface RequestAccessModel {
  id: string;
  requestType: string;
  machineState: string;
  comment: string;
  created: string;
  modified: string;
  dateLastTransitioned: string;
  requestedPermissions: string | null;
  creator: UserModel;
}
