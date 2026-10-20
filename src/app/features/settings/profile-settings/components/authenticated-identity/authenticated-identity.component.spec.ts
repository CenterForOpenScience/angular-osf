import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { AuthService } from '@core/services/auth.service';
import { AccountSettingsSelectors } from '@osf/features/settings/account-settings/store/account-settings.selectors';
import { ExternalIdentityStatus } from '@osf/shared/enums/external-identity-status.enum';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { AuthServiceMock, AuthServiceMockType } from '@testing/providers/auth-service.mock';
import {
  ExternalIdentityDeletionServiceMock,
  ExternalIdentityDeletionServiceMockType,
} from '@testing/providers/external-identity-deletion-service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { ExternalIdentityDeletionService } from '../../../account-settings/services';
import { GetExternalIdentities } from '../../../account-settings/store';

import { AuthenticatedIdentityComponent } from './authenticated-identity.component';

describe('AuthenticatedIdentityComponent', () => {
  let component: AuthenticatedIdentityComponent;
  let fixture: ComponentFixture<AuthenticatedIdentityComponent>;
  let store: Store;
  let externalIdentityDeletion: ExternalIdentityDeletionServiceMockType;
  let authServiceMock: AuthServiceMockType;

  const mockExternalIdentities = signal([
    {
      id: 'ORCID',
      externalId: '0001-0002-0003-0004',
      status: ExternalIdentityStatus.VERIFIED,
    },
  ]);

  beforeEach(() => {
    externalIdentityDeletion = ExternalIdentityDeletionServiceMock.simple();
    authServiceMock = AuthServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [AuthenticatedIdentityComponent],
      providers: [
        provideOSFCore(),
        MockProvider(ENVIRONMENT, { webUrl: 'http://localhost:4200', casUrl: 'http://localhost:8080' }),
        MockProvider(AuthService, authServiceMock),
        MockProvider(ExternalIdentityDeletionService, externalIdentityDeletion),
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

  it('should delegate ORCID disconnect to the deletion service', () => {
    component.disconnectOrcid();

    expect(externalIdentityDeletion.confirmAndDelete).toHaveBeenCalledWith('ORCID');
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
