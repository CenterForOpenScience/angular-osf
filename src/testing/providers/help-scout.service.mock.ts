import { HelpScoutService } from '@core/services/help-scout.service';

export function HelpScoutServiceMockFactory() {
  return {
    setResourceType: jest.fn(),
    unsetResourceType: jest.fn(),
  } as unknown as jest.Mocked<HelpScoutService>;
}
