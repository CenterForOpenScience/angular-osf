import { createDispatchMap } from '@ngxs/store';

import { finalize } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { DeleteExternalIdentity } from '../store';

@Injectable({
  providedIn: 'root',
})
export class ExternalIdentityDeletionService {
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

  private readonly actions = createDispatchMap({ deleteExternalIdentity: DeleteExternalIdentity });

  confirmAndDelete(identityId: string): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.accountSettings.connectedIdentities.deleteDialog.header',
      messageParams: { name: identityId },
      messageKey: 'settings.accountSettings.connectedIdentities.deleteDialog.message',
      onConfirm: () => {
        this.loaderService.show();
        this.actions
          .deleteExternalIdentity(identityId)
          .pipe(finalize(() => this.loaderService.hide()))
          .subscribe({
            next: () => this.toastService.showSuccess('settings.accountSettings.connectedIdentities.successDelete'),
            error: (error: HttpErrorResponse) => this.toastService.showError(this.getDeleteErrorKey(error)),
          });
      },
    });
  }

  private getDeleteErrorKey(error: HttpErrorResponse): string {
    const prefix = 'settings.accountSettings.connectedIdentities.errors';

    switch (error.status) {
      case 503:
        return `${prefix}.retryLater`;
      case 409:
        return `${prefix}.signInViaOrcid`;
      default:
        return `${prefix}.contactSupport`;
    }
  }
}
