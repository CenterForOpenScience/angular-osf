import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { UserSelectors } from '@osf/core/store/user';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ToastService } from '@osf/shared/services/toast.service';
import { RegionsSelectors } from '@osf/shared/stores/regions';

import { AccountSettingsComponent } from './account-settings.component';
import {
  AffiliatedInstitutionsComponent,
  ChangePasswordComponent,
  ConnectedEmailsComponent,
  ConnectedIdentitiesComponent,
  DeactivateAccountComponent,
  DefaultStorageLocationComponent,
  ShareIndexingComponent,
  TwoFactorAuthComponent,
} from './components';
import { AccountSettingsSelectors } from './store';

import { MockCustomConfirmationServiceProvider } from '@testing/mocks/custom-confirmation.service.mock';
import { MOCK_USER } from '@testing/mocks/data.mock';
import { MOCK_STORE } from '@testing/mocks/mock-store.mock';
import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;
  const store = MOCK_STORE;

  beforeEach(async () => {
    store.selectSignal.mockImplementation((selector) => {
      switch (selector) {
        case UserSelectors.getCurrentUser:
          return () => MOCK_USER;

        case AccountSettingsSelectors.getAccountSettings:
          return () => null;

        case AccountSettingsSelectors.getExternalIdentities:
          return () => null;

        case RegionsSelectors.getRegions:
          return () => null;

        case AccountSettingsSelectors.getUserInstitutions:
          return () => null;

        default:
          return () => [];
      }
    });
    await TestBed.configureTestingModule({
      imports: [
        AccountSettingsComponent,
        ...MockComponents(
          SubHeaderComponent,
          ConnectedEmailsComponent,
          DefaultStorageLocationComponent,
          ConnectedIdentitiesComponent,
          ShareIndexingComponent,
          ChangePasswordComponent,
          TwoFactorAuthComponent,
          DeactivateAccountComponent,
          AffiliatedInstitutionsComponent
        ),
        MockPipe(TranslatePipe),
      ],
      providers: [
        MockCustomConfirmationServiceProvider,
        TranslateServiceMock,
        MockProvider(ToastService),
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(Store, store),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not dispatch actions when currentUser is null', () => {
    store.selectSignal.mockImplementation((selector) =>
      selector === UserSelectors.getCurrentUser ? () => null : () => []
    );

    store.dispatch.mockClear();

    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
