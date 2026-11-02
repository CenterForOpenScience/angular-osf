import { MockComponent, MockProvider } from 'ng-mocks';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieConsentService } from '@core/services/cookie-consent.service';
import { IconComponent } from '@osf/shared/components/icon/icon.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { CookieConsentServiceMock, CookieConsentServiceMockType } from '@testing/providers/cookie-consent.service.mock';

import { CookieConsentBannerComponent } from './cookie-consent-banner.component';

describe('Component: Cookie Consent Banner', () => {
  let fixture: ComponentFixture<CookieConsentBannerComponent>;
  let component: CookieConsentBannerComponent;
  let cookieConsentMock: CookieConsentServiceMockType;

  function setup(overrides: { hasConsent?: boolean; isBrowser?: boolean } = {}) {
    cookieConsentMock = CookieConsentServiceMock.simple();
    cookieConsentMock.hasConsent.mockReturnValue(overrides.hasConsent ?? false);

    TestBed.configureTestingModule({
      imports: [CookieConsentBannerComponent, MockComponent(IconComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(CookieConsentService, cookieConsentMock),
        MockProvider(PLATFORM_ID, overrides.isBrowser === false ? 'server' : 'browser'),
      ],
    });

    fixture = TestBed.createComponent(CookieConsentBannerComponent);
    component = fixture.componentInstance;
  }

  it('should show the banner when consent is missing', () => {
    setup();

    expect(component.displayBanner()).toBe(true);
  });

  it('should hide the banner when consent is already recorded', () => {
    setup({ hasConsent: true });

    expect(component.displayBanner()).toBe(false);
  });

  it('should keep the banner hidden outside the browser', () => {
    setup({ isBrowser: false });

    expect(component.displayBanner()).toBe(false);
    expect(cookieConsentMock.hasConsent).not.toHaveBeenCalled();
  });

  it('should accept cookies and hide the banner', () => {
    setup();

    component.acceptCookies();

    expect(cookieConsentMock.accept).toHaveBeenCalled();
    expect(component.displayBanner()).toBe(false);
  });
});
