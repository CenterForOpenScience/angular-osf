import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { CookieConsentBannerComponent } from './cookie-consent-banner/cookie-consent-banner.component';
import { MaintenanceBannerComponent } from './maintenance-banner/maintenance-banner.component';
import { TosConsentBannerComponent } from './tos-consent-banner/tos-consent-banner.component';
import { OSFBannerComponent } from './osf-banner.component';

describe('Component: OSF Banner', () => {
  let fixture: ComponentFixture<OSFBannerComponent>;
  let component: OSFBannerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OSFBannerComponent,
        ...MockComponents(MaintenanceBannerComponent, CookieConsentBannerComponent, TosConsentBannerComponent),
      ],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(OSFBannerComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
