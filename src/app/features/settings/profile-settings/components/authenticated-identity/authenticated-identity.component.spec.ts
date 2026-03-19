import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingsSelectors } from '@osf/features/settings/account-settings/store/account-settings.selectors';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { AuthenticatedIdentityComponent } from './authenticated-identity.component';

import { MockCustomConfirmationServiceProvider } from '@testing/mocks/custom-confirmation.service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('AuthenticatedIdentityComponent', () => {
  let component: AuthenticatedIdentityComponent;
  let fixture: ComponentFixture<AuthenticatedIdentityComponent>;

  const mockExternalIdentities = signal([
    {
      id: 'ORCID',
      externalId: '0001-0002-0003-0004',
      status: 'VERIFIED',
    },
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticatedIdentityComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(ToastService),
        MockProvider(LoaderService),
        MockProvider(TranslateService),
        { provide: CustomConfirmationService, useValue: MockCustomConfirmationServiceProvider.useValue },
        provideMockStore({
          signals: [
            {
              selector: AccountSettingsSelectors.getExternalIdentities,
              value: mockExternalIdentities,
            },
          ],
        }),
      ],
    }).compileComponents();

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
    expect(MockCustomConfirmationServiceProvider.useValue.confirmDelete).toHaveBeenCalled();
  });

  it('should show connect button when no existing ORCID is present in external identities', () => {
    mockExternalIdentities.set([]);
    fixture.detectChanges();

    expect(component.existingOrcid()).toBeUndefined();
    expect(component.orcidUrl()).toBeNull();
  });
});
