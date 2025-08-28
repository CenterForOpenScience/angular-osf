import { Store } from '@ngxs/store';

import { of } from 'rxjs';

export const StoreMock = {
  provide: Store,
  useValue: {
    select: jest.fn().mockReturnValue(of([])),
    selectSignal: jest.fn().mockReturnValue(of([])),
    dispatch: jest.fn().mockReturnValue(of({})),
  } as unknown as jest.Mocked<Store>,
};
