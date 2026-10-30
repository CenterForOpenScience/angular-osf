import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { throwError } from 'rxjs';

import { Mock } from 'vitest';

import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

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

import { DeleteExternalIdentity } from '../store';

import { ExternalIdentityDeletionService } from './external-identity-deletion.service';

describe('ExternalIdentityDeletionService', () => {
  let service: ExternalIdentityDeletionService;
  let store: Store;
  let loaderService: LoaderServiceMock;
  let confirmationService: CustomConfirmationServiceMockType;
  let toastService: ToastServiceMockType;

  const identityId = 'ORCID';

  const confirm = () => {
    const { onConfirm } = confirmationService.confirmDelete.mock.calls[0][0];
    onConfirm();
  };

  beforeEach(() => {
    loaderService = new LoaderServiceMock();
    confirmationService = CustomConfirmationServiceMock.simple();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        MockProvider(LoaderService, loaderService),
        MockProvider(CustomConfirmationService, confirmationService),
        MockProvider(ToastService, toastService),
        provideMockStore(),
      ],
    });

    store = TestBed.inject(Store);
    service = TestBed.inject(ExternalIdentityDeletionService);
  });

  it('should open delete confirmation with expected payload', () => {
    service.confirmAndDelete(identityId);

    expect(confirmationService.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'settings.accountSettings.connectedIdentities.deleteDialog.header',
      messageParams: { name: identityId },
      messageKey: 'settings.accountSettings.connectedIdentities.deleteDialog.message',
      onConfirm: expect.any(Function),
    });
  });

  it('should not dispatch delete until confirmation is accepted', () => {
    (store.dispatch as Mock).mockClear();
    service.confirmAndDelete(identityId);

    expect(loaderService.show).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should dispatch delete and show success when confirmation is accepted', () => {
    (store.dispatch as Mock).mockClear();
    service.confirmAndDelete(identityId);
    confirm();

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new DeleteExternalIdentity(identityId));
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.accountSettings.connectedIdentities.successDelete');
    expect(toastService.showError).not.toHaveBeenCalled();
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it.each([
    [503, 'settings.accountSettings.connectedIdentities.errors.retryLater'],
    [409, 'settings.accountSettings.connectedIdentities.errors.signInViaOrcid'],
    [500, 'settings.accountSettings.connectedIdentities.errors.contactSupport'],
    [404, 'settings.accountSettings.connectedIdentities.errors.contactSupport'],
  ])('should show the matching error toast for status %i', (status, messageKey) => {
    (store.dispatch as Mock).mockReturnValue(throwError(() => new HttpErrorResponse({ status })));
    service.confirmAndDelete(identityId);
    confirm();

    expect(toastService.showError).toHaveBeenCalledWith(messageKey);
    expect(toastService.showSuccess).not.toHaveBeenCalled();
    expect(loaderService.hide).toHaveBeenCalled();
  });
});
