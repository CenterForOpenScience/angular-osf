import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { GetEmails } from '@core/store/user-emails';
import { UserSelectors } from '@osf/core/store/user';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { FetchRegions } from '@osf/shared/stores/regions';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

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
import { GetAccountSettings, GetExternalIdentities, GetUserInstitutions } from './store';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;
  let store: Store;

  const defaultSignals: SignalOverride[] = [{ selector: UserSelectors.getCurrentUser, value: MOCK_USER }];

  function setup(overrides: BaseSetupOverrides = {}) {
    TestBed.configureTestingModule({
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
      ],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should dispatch initial account settings actions when user exists', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledTimes(5);
    expect(store.dispatch).toHaveBeenCalledWith(new GetAccountSettings());
    expect(store.dispatch).toHaveBeenCalledWith(new GetEmails());
    expect(store.dispatch).toHaveBeenCalledWith(new GetExternalIdentities());
    expect(store.dispatch).toHaveBeenCalledWith(new FetchRegions());
    expect(store.dispatch).toHaveBeenCalledWith(new GetUserInstitutions());
  });

  it('should not dispatch initial actions when current user is null', () => {
    setup({
      selectorOverrides: [{ selector: UserSelectors.getCurrentUser, value: null }],
    });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should render settings section when current user has id', () => {
    setup();

    const section = fixture.debugElement.query(By.css('section'));

    expect(section).toBeTruthy();
  });

  it('should hide settings section when current user is null', () => {
    setup({
      selectorOverrides: [{ selector: UserSelectors.getCurrentUser, value: null }],
    });

    const section = fixture.debugElement.query(By.css('section'));

    expect(section).toBeNull();
  });
});
