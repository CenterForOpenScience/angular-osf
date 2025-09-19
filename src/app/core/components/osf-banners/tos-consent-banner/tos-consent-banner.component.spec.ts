import { Store } from '@ngxs/store';

import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AcceptTermsOfServiceByUser } from '@core/store/user';
import { UserSelectors } from '@osf/core/store/user';
import { MOCK_USER } from '@osf/shared/mocks';
import { IconComponent } from '@shared/components';

import { TosConsentBannerComponent } from './tos-consent-banner.component';

import { TranslationServiceMock } from '@testing/mocks/translation.service.mock';
import { OSFTestingStoreModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('Component: Tos Consent Banner', () => {
  let fixture: ComponentFixture<TosConsentBannerComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OSFTestingStoreModule, TosConsentBannerComponent, MockComponent(IconComponent)],
      providers: [
        provideMockStore({
          signals: [{ selector: UserSelectors.getCurrentUser, value: MOCK_USER }],
        }),
        TranslationServiceMock,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TosConsentBannerComponent);
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should have the "Continue" button disabled by default', () => {
    const continueButton = fixture.debugElement.query(By.css('p-button button')).nativeElement;
    expect(continueButton.disabled).toBe(true);
  });

  it('should enable the "Continue" button when the checkbox is checked', () => {
    const checkboxInput = fixture.debugElement.query(By.css('p-checkbox input')).nativeElement;
    checkboxInput.click();
    fixture.detectChanges();
    const continueButton = fixture.debugElement.query(By.css('p-button button')).nativeElement;
    expect(continueButton.disabled).toBe(false);
  });

  it('should dispatch AcceptTermsOfServiceByUser action when "Continue" is clicked', () => {
    jest.spyOn(store, 'dispatch');
    const checkboxInput = fixture.debugElement.query(By.css('p-checkbox input')).nativeElement;
    checkboxInput.click();
    fixture.detectChanges();

    const continueButton = fixture.debugElement.query(By.css('p-button button')).nativeElement;
    continueButton.click();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(new AcceptTermsOfServiceByUser());
  });
});
