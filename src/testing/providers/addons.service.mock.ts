import { of } from 'rxjs';

import { AddonsService } from '@osf/shared/services/addons/addons.service';
import { OperationInvocation } from '@shared/models/addons/operation-invocation.model';

export function AddonsServiceMockFactory() {
  return {
    createAddonOperationInvocation: jest.fn().mockReturnValue(of({} as OperationInvocation)),
  } as unknown as jest.Mocked<AddonsService>;
}
