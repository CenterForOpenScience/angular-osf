import { IdNameModel } from '@osf/shared/models/common/id-name.model';

import { PreprintRequestMachineState, PreprintRequestType } from '../enums';

export interface PreprintRequest {
  id: string;
  comment: string;
  machineState: PreprintRequestMachineState;
  requestType: PreprintRequestType;
  dateLastTransitioned: Date;
  creator: IdNameModel;
}
