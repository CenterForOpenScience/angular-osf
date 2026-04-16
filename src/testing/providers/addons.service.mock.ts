import { of } from 'rxjs';

import { Mocked } from 'vitest';

import { AddonsService } from '@osf/shared/services/addons/addons.service';
import { OperationInvocation } from '@shared/models/addons/operation-invocation.model';

export function AddonsServiceMockFactory() {
  return {
    createAddonOperationInvocation: vi.fn().mockReturnValue(of({} as OperationInvocation)),
  } as unknown as Mocked<AddonsService>;
}
