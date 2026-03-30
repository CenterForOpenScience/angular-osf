import { of } from 'rxjs';

import { AnalyticsService } from '@osf/shared/services/analytics.service';

export function AnalyticsServiceMockFactory() {
  return {
    sendCountedUsage: jest.fn().mockReturnValue(of(void 0)),
    sendCountedUsageForRegistrationAndProjects: jest.fn(),
  } as unknown as jest.Mocked<AnalyticsService>;
}
