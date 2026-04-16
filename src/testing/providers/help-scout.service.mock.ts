import { Mocked } from 'vitest';

import { HelpScoutService } from '@core/services/help-scout.service';

export function HelpScoutServiceMockFactory() {
  return {
    setResourceType: vi.fn(),
    unsetResourceType: vi.fn(),
  } as unknown as Mocked<HelpScoutService>;
}
