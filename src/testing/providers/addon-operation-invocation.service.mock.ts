import { AddonOperationInvocationService } from '@osf/shared/services/addons/addon-operation-invocation.service';
import { OperationInvocationRequestJsonApi } from '@shared/models/addons/addon-operations-json-api.models';

export function AddonOperationInvocationServiceMockFactory() {
  return {
    createInitialOperationInvocationPayload: jest.fn().mockReturnValue({} as OperationInvocationRequestJsonApi),
    createOperationInvocationPayload: jest.fn().mockReturnValue({} as OperationInvocationRequestJsonApi),
  } as unknown as jest.Mocked<AddonOperationInvocationService>;
}
