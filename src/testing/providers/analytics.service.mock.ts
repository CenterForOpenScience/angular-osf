import { of } from 'rxjs';

import { Mocked } from 'vitest';

import { AnalyticsService } from '@osf/shared/services/analytics.service';

export function AnalyticsServiceMockFactory() {
  return {
    sendCountedUsage: vi.fn().mockReturnValue(of(void 0)),
    sendCountedUsageForRegistrationAndProjects: vi.fn(),
  } as unknown as Mocked<AnalyticsService>;
}
