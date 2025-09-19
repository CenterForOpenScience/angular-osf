import { TranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieConsentService } from '../../../../shared/services/cookie-consent/cookie-consent.service';

import { CookieConsentBannerComponent } from './cookie-consent-banner.component';

describe('CookieConsentComponent', () => {
  let component: CookieConsentBannerComponent;
  let fixture: ComponentFixture<CookieConsentBannerComponent>;
  let mockToastService: jest.Mocked<MessageService>;
  let mockConsentService: jest.Mocked<CookieConsentService>;
  let mockTranslateService: jest.Mocked<TranslateService>;

  beforeEach(async () => {
    mockToastService = {
      add: jest.fn(),
      clear: jest.fn(),
    } as unknown as jest.Mocked<MessageService>;

    mockConsentService = {
      hasConsent: jest.fn(),
      grantConsent: jest.fn(),
    } as unknown as jest.Mocked<CookieConsentService>;

    mockTranslateService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<TranslateService>;

    await TestBed.configureTestingModule({
      imports: [CookieConsentBannerComponent],
      providers: [
        { provide: MessageService, useValue: mockToastService },
        { provide: CookieConsentService, useValue: mockConsentService },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CookieConsentBannerComponent);
    component = fixture.componentInstance;
  });
  describe('ngAfterViewInit', () => {
    it('should show toast if no consent', () => {
      mockConsentService.hasConsent.mockReturnValue(false);
      mockTranslateService.get.mockReturnValue(of('Please accept cookies'));

      component.ngAfterViewInit();

      // wait for queueMicrotask to execute
      return Promise.resolve().then(() => {
        expect(mockTranslateService.get).toHaveBeenCalledWith('toast.cookie-consent.message');
        expect(mockToastService.add).toHaveBeenCalledWith({
          detail: 'Please accept cookies',
          key: 'cookie',
          sticky: true,
          severity: 'warn',
          closable: false,
        });
      });
    });

    it('should not show toast if consent already given', () => {
      mockConsentService.hasConsent.mockReturnValue(true);

      component.ngAfterViewInit();

      expect(mockTranslateService.get).not.toHaveBeenCalled();
      expect(mockToastService.add).not.toHaveBeenCalled();
    });
  });

  describe('acceptCookies', () => {
    it('should grant consent and clear toast', () => {
      component.acceptCookies();
      expect(mockConsentService.grantConsent).toHaveBeenCalled();
      expect(mockToastService.clear).toHaveBeenCalledWith('cookie');
    });
  });
});
