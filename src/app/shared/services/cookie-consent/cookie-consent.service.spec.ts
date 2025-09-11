import { TestBed } from '@angular/core/testing';

import { CookieConsentService } from './cookie-consent.service';

describe('CookieConsentService', () => {
  let service: CookieConsentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookieConsentService);

    const store: Record<string, string> = {};
    jest.spyOn(localStorage, 'getItem').mockImplementation((key: string) => store[key] || null);
    jest.spyOn(localStorage, 'setItem').mockImplementation((key: string, value: string) => {
      store[key] = value;
    });
    jest.spyOn(localStorage, 'removeItem').mockImplementation((key: string) => {
      delete store[key];
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return false if no consent is stored', () => {
    expect(service.hasConsent()).toBe(false);
  });

  it('should return true after consent is granted', () => {
    service.grantConsent();
    expect(service.hasConsent()).toBe(true);
  });

  it('should remove consent when revoked', () => {
    service.grantConsent();
    expect(service.hasConsent()).toBe(true);

    service.revokeConsent();
    expect(service.hasConsent()).toBe(false);
  });
});
