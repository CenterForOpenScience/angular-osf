import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { ConfirmDeleteDraftOptions } from '../models/preprint-draft-deletion.model';

@Injectable()
export class PreprintDraftDeletionService {
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  private preprintDeleted = false;

  canDeactivate(hasBeenSubmitted: boolean): boolean {
    return hasBeenSubmitted || this.preprintDeleted;
  }

  deleteOnDestroyIfNeeded(onDelete: () => void): void {
    if (!this.preprintDeleted) {
      onDelete();
    }
  }

  confirmDeleteDraft(options: ConfirmDeleteDraftOptions): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'preprints.preprintStepper.deleteDraft.header',
      messageKey: 'preprints.preprintStepper.deleteDraft.message',
      onConfirm: () => {
        this.preprintDeleted = true;
        options.onDelete();
        options.onReset();
        this.toastService.showSuccess('preprints.preprintStepper.deleteDraft.success');
        this.router.navigateByUrl(options.redirectUrl);
      },
    });
  }
}
