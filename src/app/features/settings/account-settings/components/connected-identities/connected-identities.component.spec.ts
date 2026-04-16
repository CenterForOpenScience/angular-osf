import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadonlyInputComponent } from '@osf/shared/components/readonly-input/readonly-input.component';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { ExternalIdentity } from '../../models';
import { AccountSettingsSelectors, DeleteExternalIdentity } from '../../store';

import { ConnectedIdentitiesComponent } from './connected-identities.component';

describe('ConnectedIdentitiesComponent', () => {
  let component: ConnectedIdentitiesComponent;
  let fixture: ComponentFixture<ConnectedIdentitiesComponent>;
  let store: Store;
  let loaderService: LoaderServiceMock;
  let confirmationService: CustomConfirmationServiceMockType;
  let toastService: ToastServiceMockType;

  const mockIdentity: ExternalIdentity = {
    id: 'orcid',
    externalId: '0000-0000-0000-0000',
    status: 'VERIFIED',
  };

  beforeEach(() => {
    loaderService = new LoaderServiceMock();
    confirmationService = CustomConfirmationServiceMock.simple();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [ConnectedIdentitiesComponent, MockComponent(ReadonlyInputComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(LoaderService, loaderService),
        MockProvider(CustomConfirmationService, confirmationService),
        MockProvider(ToastService, toastService),
        provideMockStore({
          signals: [{ selector: AccountSettingsSelectors.getExternalIdentities, value: [mockIdentity] }],
        }),
      ],
    });

    store = TestBed.inject(Store);
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

  it('should open delete confirmation with expected payload', () => {
    component.deleteExternalIdentity(mockIdentity);

    expect(confirmationService.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'settings.accountSettings.connectedIdentities.deleteDialog.header',
      messageParams: { name: mockIdentity.id },
      messageKey: 'settings.accountSettings.connectedIdentities.deleteDialog.message',
      onConfirm: expect.any(Function),
    });
  });

  it('should dispatch delete and show success when confirmation is accepted', () => {
    (store.dispatch as Mock).mockClear();
    component.deleteExternalIdentity(mockIdentity);

    const { onConfirm } = confirmationService.confirmDelete.mock.calls[0][0];
    onConfirm();

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new DeleteExternalIdentity(mockIdentity.id));
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.accountSettings.connectedIdentities.successDelete');
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it('should not dispatch delete when confirmation is not accepted', () => {
    (store.dispatch as Mock).mockClear();
    component.deleteExternalIdentity(mockIdentity);

    expect(loaderService.show).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(DeleteExternalIdentity));
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });
});
