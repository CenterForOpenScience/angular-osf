import { PreprintRequestMachineState, PreprintRequestType } from '@osf/features/preprints/enums';
import { IdName } from '@shared/models';

export interface PreprintRequest {
  id: string;
  comment: string;
  machineState: PreprintRequestMachineState;
  requestType: PreprintRequestType;
  dateLastTransitioned: Date;
  creator: IdName;
}
