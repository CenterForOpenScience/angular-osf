import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadonlyInputComponent } from '@osf/shared/components/readonly-input/readonly-input.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  ExternalIdentityDeletionServiceMock,
  ExternalIdentityDeletionServiceMockType,
} from '@testing/providers/external-identity-deletion-service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { ExternalIdentity } from '../../models';
import { ExternalIdentityDeletionService } from '../../services';
import { AccountSettingsSelectors } from '../../store';

import { ConnectedIdentitiesComponent } from './connected-identities.component';

describe('ConnectedIdentitiesComponent', () => {
  let component: ConnectedIdentitiesComponent;
  let fixture: ComponentFixture<ConnectedIdentitiesComponent>;
  let externalIdentityDeletion: ExternalIdentityDeletionServiceMockType;

  const mockIdentity: ExternalIdentity = {
    id: 'orcid',
    externalId: '0000-0000-0000-0000',
    status: 'VERIFIED',
  };

  beforeEach(() => {
    externalIdentityDeletion = ExternalIdentityDeletionServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [ConnectedIdentitiesComponent, MockComponent(ReadonlyInputComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ExternalIdentityDeletionService, externalIdentityDeletion),
        provideMockStore({
          signals: [{ selector: AccountSettingsSelectors.getExternalIdentities, value: [mockIdentity] }],
        }),
      ],
    });

    fixture = TestBed.createComponent(ConnectedIdentitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose external identities from selector', () => {
    expect(component.externalIdentities()).toEqual([mockIdentity]);
  });

  it('should delegate deletion of the identity to the deletion service', () => {
    component.deleteExternalIdentity(mockIdentity);

    expect(externalIdentityDeletion.confirmAndDelete).toHaveBeenCalledWith(mockIdentity.id);
  });
});
