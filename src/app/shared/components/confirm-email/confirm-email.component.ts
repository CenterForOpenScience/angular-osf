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
    this.actions
      .deleteEmail(this.email.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toastService.showSuccess('home.confirmEmail.emailNotAdded', { name: this.email.emailAddress });
        this.dialogRef.close();
      });
  }

  verifyEmail() {
    this.actions
      .verifyEmail(this.email.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('home.confirmEmail.emailVerified', { name: this.email.emailAddress });
          this.dialogRef.close();
        },
        error: () => this.dialogRef.close(),
      });
  }
}
