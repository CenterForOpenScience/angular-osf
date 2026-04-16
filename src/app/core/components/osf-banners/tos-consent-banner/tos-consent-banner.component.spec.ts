import { Store } from '@ngxs/store';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AcceptTermsOfServiceByUser, UserSelectors } from '@core/store/user';
import { UserModel } from '@osf/shared/models/user/user.model';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

import { TosConsentBannerComponent } from './tos-consent-banner.component';

describe('TosConsentBannerComponent', () => {
  let component: TosConsentBannerComponent;
  let fixture: ComponentFixture<TosConsentBannerComponent>;
  let store: Store;

  function setup(overrides: BaseSetupOverrides = {}) {
    TestBed.configureTestingModule({
      imports: [TosConsentBannerComponent],
      providers: [
        provideOSFCore(),
        provideRouter([]),
        provideMockStore({
          signals: mergeSignalOverrides(
            [
              {
                selector: UserSelectors.getCurrentUser,
                value: {
                  ...MOCK_USER,
                  acceptedTermsOfService: false,
                } as UserModel,
              },
            ],
            overrides.selectorOverrides
          ),
        }),
      ],
    });

    fixture = TestBed.createComponent(TosConsentBannerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should return true when current user is null', () => {
    setup({
      selectorOverrides: [{ selector: UserSelectors.getCurrentUser, value: null }],
    });
    expect(component.acceptedTermsOfServiceChange()).toBe(true);
  });

  it('should return false when current user has not accepted terms', () => {
    setup({
      selectorOverrides: [
        {
          selector: UserSelectors.getCurrentUser,
          value: { ...MOCK_USER, acceptedTermsOfService: false } as UserModel,
        },
      ],
    });
    expect(component.acceptedTermsOfServiceChange()).toBe(false);
  });

  it('should return true when current user has accepted terms', () => {
    setup({
      selectorOverrides: [
        {
          selector: UserSelectors.getCurrentUser,
          value: { ...MOCK_USER, acceptedTermsOfService: true } as UserModel,
        },
      ],
    });
    expect(component.acceptedTermsOfServiceChange()).toBe(true);
  });

  it('should dispatch AcceptTermsOfServiceByUser on continue', () => {
    setup();
    component.onContinue();
    expect(store.dispatch).toHaveBeenCalledWith(new AcceptTermsOfServiceByUser());
  });

  it('should render banner when terms are not accepted', () => {
    setup({
      selectorOverrides: [
        {
          selector: UserSelectors.getCurrentUser,
          value: { ...MOCK_USER, acceptedTermsOfService: false } as UserModel,
        },
      ],
    });
    const banner = fixture.debugElement.query(By.css('p-message'));
    expect(banner).toBeTruthy();
  });

  it('should not render banner when terms are accepted', () => {
    setup({
      selectorOverrides: [
        {
          selector: UserSelectors.getCurrentUser,
          value: { ...MOCK_USER, acceptedTermsOfService: true } as UserModel,
        },
      ],
    });
    const banner = fixture.debugElement.query(By.css('p-message'));
    expect(banner).toBeNull();
  });
});
