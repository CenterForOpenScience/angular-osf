import { PreprintRequestMachineState, PreprintRequestType } from '@osf/features/preprints/enums';
import { PreprintRequest } from '@osf/features/preprints/models';

export const PREPRINT_REQUEST_MOCK: PreprintRequest = {
  id: 'request-1',
  comment: 'Withdrawal request comment',
  machineState: PreprintRequestMachineState.Pending,
  requestType: PreprintRequestType.Withdrawal,
  dateLastTransitioned: new Date('2024-01-01T10:00:00Z'),
  creator: {
    id: 'user-123',
    name: 'John Doe',
  },
};
