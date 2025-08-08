import { PreprintRequestMachineState, PreprintRequestType } from '@osf/features/preprints/enums';

export interface PreprintRequest {
  id: string;
  comment: string;
  machineState: PreprintRequestMachineState;
  requestType: PreprintRequestType;
}
