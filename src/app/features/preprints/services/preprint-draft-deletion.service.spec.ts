import { MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { PreprintDraftDeletionService } from './preprint-draft-deletion.service';

describe('PreprintDraftDeletionService', () => {
  let service: PreprintDraftDeletionService;
  let confirmationMock: CustomConfirmationServiceMockType;
  let toastMock: ToastServiceMockType;
  let routerMock: RouterMockType;

  beforeEach(() => {
    confirmationMock = CustomConfirmationServiceMock.simple();
    toastMock = ToastServiceMock.simple();
    routerMock = RouterMockBuilder.create().build();

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        PreprintDraftDeletionService,
        MockProvider(CustomConfirmationService, confirmationMock),
        MockProvider(ToastService, toastMock),
        MockProvider(Router, routerMock),
      ],
    });

    service = TestBed.inject(PreprintDraftDeletionService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should open confirm delete and run reset, toast, navigate on confirm', () => {
    const onReset = vi.fn();

    service.confirmDeleteDraft({
      onReset,
      redirectUrl: '/preprints',
    });

    expect(confirmationMock.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'preprints.preprintStepper.deleteDraft.header',
      messageKey: 'preprints.preprintStepper.deleteDraft.message',
      onConfirm: expect.any(Function),
    });

    const { onConfirm } = confirmationMock.confirmDelete.mock.calls[0][0];
    onConfirm();

    expect(onReset).toHaveBeenCalled();
    expect(toastMock.showSuccess).toHaveBeenCalledWith('preprints.preprintStepper.deleteDraft.success');
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/preprints');
  });

  it('should allow canDeactivate after confirmed delete', () => {
    const onReset = vi.fn();

    service.confirmDeleteDraft({ onReset, redirectUrl: '/x' });
    const { onConfirm } = confirmationMock.confirmDelete.mock.calls[0][0];
    onConfirm();

    expect(service.canDeactivate(false)).toBe(true);
  });

  it('should return canDeactivate true when submitted', () => {
    expect(service.canDeactivate(true)).toBe(true);
  });
});
