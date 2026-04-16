import { Mocked } from 'vitest';

import { PrerenderReadyService } from '@core/services/prerender-ready.service';

export function PrerenderReadyServiceMockFactory() {
  return {
    setNotReady: vi.fn(),
    setReady: vi.fn(),
  } as unknown as Mocked<PrerenderReadyService>;
}
