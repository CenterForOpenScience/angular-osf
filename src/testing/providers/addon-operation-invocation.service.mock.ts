import { Mocked } from 'vitest';

import { OperationInvocationRequestJsonApi } from '@osf/shared/models/addons/addon-operations-json-api.model';
import { AddonOperationInvocationService } from '@osf/shared/services/addons/addon-operation-invocation.service';

export function AddonOperationInvocationServiceMockFactory() {
  return {
    createInitialOperationInvocationPayload: vi.fn().mockReturnValue({} as OperationInvocationRequestJsonApi),
    createOperationInvocationPayload: vi.fn().mockReturnValue({} as OperationInvocationRequestJsonApi),
  } as unknown as Mocked<AddonOperationInvocationService>;
}
