import { PrerenderReadyService } from '@core/services/prerender-ready.service';

export function PrerenderReadyServiceMockFactory() {
  return {
    setNotReady: jest.fn(),
    setReady: jest.fn(),
  } as unknown as jest.Mocked<PrerenderReadyService>;
}
