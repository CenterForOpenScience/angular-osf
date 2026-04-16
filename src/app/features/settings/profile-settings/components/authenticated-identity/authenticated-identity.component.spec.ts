import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { AuthService } from '@core/services/auth.service';
import { AccountSettingsSelectors } from '@osf/features/settings/account-settings/store/account-settings.selectors';
import { ExternalIdentityStatus } from '@osf/shared/enums/external-identity-status.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { AuthServiceMock, AuthServiceMockType } from '@testing/providers/auth-service.mock';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { DeleteExternalIdentity, GetExternalIdentities } from '../../../account-settings/store';

import { AuthenticatedIdentityComponent } from './authenticated-identity.component';

describe('AuthenticatedIdentityComponent', () => {
  let component: AuthenticatedIdentityComponent;
  let fixture: ComponentFixture<AuthenticatedIdentityComponent>;
  let store: Store;
  let customConfirmationServiceMock: CustomConfirmationServiceMockType;
  let loaderServiceMock: LoaderServiceMock;
  let toastServiceMock: ToastServiceMockType;
  let authServiceMock: AuthServiceMockType;

  const mockExternalIdentities = signal([
    {
      id: 'ORCID',
      externalId: '0001-0002-0003-0004',
      status: ExternalIdentityStatus.VERIFIED,
    },
  ]);

  beforeEach(() => {
    customConfirmationServiceMock = CustomConfirmationServiceMock.simple();
    loaderServiceMock = new LoaderServiceMock();
    toastServiceMock = ToastServiceMock.simple();
    authServiceMock = AuthServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [AuthenticatedIdentityComponent],
      providers: [
        provideOSFCore(),
        MockProvider(ENVIRONMENT, { webUrl: 'http://localhost:4200', casUrl: 'http://localhost:8080' }),
        MockProvider(AuthService, authServiceMock),
        MockProvider(LoaderService, loaderServiceMock),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        MockProvider(ToastService, toastServiceMock),
        provideMockStore({
          signals: [
            {
              selector: AccountSettingsSelectors.getExternalIdentities,
              value: mockExternalIdentities,
            },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(AuthenticatedIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show existing user ORCID when present in external identities', () => {
    expect(component.existingOrcid()).toEqual('0001-0002-0003-0004');
    expect(component.orcidUrl()).toEqual('https://orcid.org/0001-0002-0003-0004');
    component.disconnectOrcid();
    expect(customConfirmationServiceMock.confirmDelete).toHaveBeenCalled();
  });

  it('should show connect button when no existing ORCID is present in external identities', () => {
    mockExternalIdentities.set([]);
    fixture.detectChanges();

    expect(component.existingOrcid()).toBeUndefined();
    expect(component.orcidUrl()).toBeNull();
  });

  it('should dispatch get external identities on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(new GetExternalIdentities());
  });

  it('should delete ORCID and show success when confirmation is accepted', () => {
    (store.dispatch as Mock).mockClear();
    component.disconnectOrcid();

    const { onConfirm } = customConfirmationServiceMock.confirmDelete.mock.calls[0][0];
    onConfirm();

    expect(loaderServiceMock.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new DeleteExternalIdentity('ORCID'));
    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith(
      'settings.accountSettings.connectedIdentities.successDelete'
    );
    expect(loaderServiceMock.hide).toHaveBeenCalled();
  });

  it('should not delete ORCID when confirmation is not accepted', () => {
    (store.dispatch as Mock).mockClear();
    component.disconnectOrcid();

    expect(loaderServiceMock.show).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(DeleteExternalIdentity));
    expect(toastServiceMock.showSuccess).not.toHaveBeenCalled();
    expect(loaderServiceMock.hide).not.toHaveBeenCalled();
  });

  it('should redirect to CAS login with ORCID redirect and social tab destination', () => {
    component.connectOrcid();

    expect(authServiceMock.logout).toHaveBeenCalledTimes(1);

    const logoutUrl = authServiceMock.logout.mock.calls[0][0] as string;
    const casUrl = new URL(logoutUrl);

    expect(casUrl.origin).toBe('http://localhost:8080');
    expect(casUrl.pathname).toBe('/login');
    expect(casUrl.searchParams.get('redirectOrcid')).toBe('true');
    expect(casUrl.searchParams.get('service')).toBe('http://localhost:4200/login');

    const nextParam = casUrl.searchParams.get('next');
    expect(nextParam).toBeTruthy();

    const finalDestination = new URL(decodeURIComponent(nextParam as string));
    expect(finalDestination.origin).toBe('http://localhost:4200');
    expect(finalDestination.pathname).toBe('/settings/profile');
    expect(finalDestination.searchParams.get('tab')).toBe('2');
  });
});
