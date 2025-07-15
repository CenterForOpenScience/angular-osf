import { Subject } from 'rxjs';

import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

import { CanDeactivateComponent } from '@shared/models';
import { CustomConfirmationService } from '@shared/services';

export const ConfirmLeavingGuard: CanDeactivateFn<CanDeactivateComponent> = (component) => {
  const confirmationService = inject(CustomConfirmationService);
  const confirmationResultSubject = new Subject<boolean>();
  const confirmationResultObservable = confirmationResultSubject.asObservable();

  if (component.canDeactivate()) {
    return true;
  }

  confirmationService.confirmContinue({
    headerKey: 'common.discardChanges.header',
    messageKey: 'common.discardChanges.message',
    onConfirm: () => {
      confirmationResultSubject.next(true);
    },
    onReject: () => {
      confirmationResultSubject.next(false);
    },
  });

  return confirmationResultObservable;
};
