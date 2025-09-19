import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CookieConsentBannerComponent } from './cookie-consent-banner/cookie-consent-banner.component';
import { ScheduledBannerComponent } from './scheduled-banner/scheduled-banner.component';
import { OSFBannerComponent } from './osf-banner.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { MockComponentWithSignal } from '@testing/providers/component-provider.mock';

describe('Component: OSF Banner', () => {
  let fixture: ComponentFixture<OSFBannerComponent>;
  let component: OSFBannerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OSFTestingModule,
        OSFBannerComponent,
        NoopAnimationsModule,
        MockComponentWithSignal('osf-maintenance-banner'),
        MockComponent(ScheduledBannerComponent),
        MockComponent(CookieConsentBannerComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OSFBannerComponent);
    component = fixture.componentInstance;
  });
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
