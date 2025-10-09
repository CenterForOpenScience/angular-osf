import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { DeleteEmail, UserEmailsSelectors, VerifyEmail } from '@core/store/user-emails';
import { AccountEmailModel } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'osf-confirm-email',
  imports: [Button, FormsModule, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent {
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly actions = createDispatchMap({ verifyEmail: VerifyEmail, deleteEmail: DeleteEmail });

  isSubmitting = select(UserEmailsSelectors.isEmailsSubmitting);

  get email() {
    return this.config.data[0] as AccountEmailModel;
  }

  closeDialog() {
    const isMerge = this.email.isMerge;
    this.actions
      .deleteEmail(this.email.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const showSuccessText = isMerge
            ? 'home.confirmEmail.merge.emailNotAdded'
            : 'home.confirmEmail.add.emailNotAdded';
          this.toastService.showSuccess(showSuccessText, { name: this.email.emailAddress });
          this.dialogRef.close();
        },
        error: () => {
          const showErrorText = isMerge ? 'home.confirmEmail.merge.denyError' : 'home.confirmEmail.add.denyError';
          this.toastService.showError(showErrorText, { name: this.email.emailAddress });
          this.dialogRef.close();
        },
      });
  }

  verifyEmail() {
    const isMerge = this.email.isMerge;
    this.actions
      .verifyEmail(this.email.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const showSuccessText = isMerge
            ? 'home.confirmEmail.merge.emailVerified'
            : 'home.confirmEmail.add.emailVerified';
          this.toastService.showSuccess(showSuccessText, { name: this.email.emailAddress });
          this.dialogRef.close();
        },
        error: () => {
          const showErrorText = isMerge ? 'home.confirmEmail.merge.verifyError' : 'home.confirmEmail.add.verifyError';
          this.toastService.showError(showErrorText, { name: this.email.emailAddress });
          this.dialogRef.close();
        },
      });
  }
}
