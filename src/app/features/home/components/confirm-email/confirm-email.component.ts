import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { finalize } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AccountSettingsService } from '@osf/features/settings/account-settings/services';
import { LoadingSpinnerComponent } from '@shared/components';

@Component({
  selector: 'osf-confirm-email',
  imports: [Button, FormsModule, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);

  private readonly router = inject(Router);
  private readonly accountSettingsService = inject(AccountSettingsService);
  private readonly destroyRef = inject(DestroyRef);

  verifyingEmail = signal(false);

  closeDialog() {
    this.router.navigate(['/home']);
    this.dialogRef.close();
  }

  verifyEmail() {
    this.verifyingEmail.set(true);
    this.accountSettingsService
      .confirmEmail(this.config.data.userId, this.config.data.token)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.verifyingEmail.set(false))
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/settings/account-settings']);
          this.dialogRef.close();
        },
        error: () => this.closeDialog(),
      });
  }
}
