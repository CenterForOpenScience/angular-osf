import { Mock } from 'vitest';

import { CookieConsentService } from '@core/services/cookie-consent.service';

export type CookieConsentServiceMockType = Pick<CookieConsentService, 'hasConsent' | 'accept'> & {
  hasConsent: Mock;
  accept: Mock;
};

export const CookieConsentServiceMock = {
  simple(): CookieConsentServiceMockType {
    return {
      hasConsent: vi.fn().mockReturnValue(false),
      accept: vi.fn(),
    };
  },
};
