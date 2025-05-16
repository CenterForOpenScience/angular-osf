import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { UserSelectors } from '@core/store/user/user.selectors';
import { AddEmailComponent } from '@osf/features/settings/account-settings/components';
import { AccountSettingsService } from '@osf/features/settings/account-settings/services/account-settings.service';
import { DeleteEmail } from '@osf/features/settings/account-settings/store/account-settings.actions';
import { AccountSettingsSelectors } from '@osf/features/settings/account-settings/store/account-settings.selectors';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-connected-emails',
  imports: [Button, ProgressSpinner, Skeleton, TranslatePipe],
  templateUrl: './connected-emails.component.html',
  styleUrl: './connected-emails.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectedEmailsComponent {
  readonly #store = inject(Store);
  readonly #accountSettingsService = inject(AccountSettingsService);
  readonly #dialogService = inject(DialogService);
  readonly #translateService = inject(TranslateService);
  readonly isMobile = toSignal(inject(IS_XSMALL));

  protected readonly currentUser = this.#store.selectSignal(UserSelectors.getCurrentUser);
  protected readonly emails = this.#store.selectSignal(AccountSettingsSelectors.getEmails);
  protected readonly deletingEmailIds = signal<Set<string>>(new Set());
  protected readonly unconfirmedEmails = computed(() => {
    return this.emails().filter((email) => !email.confirmed && !email.primary);
  });
  protected readonly confirmedEmails = computed(() => {
    return this.emails().filter((email) => email.confirmed && !email.primary);
  });
  protected readonly primaryEmail = computed(() => {
    return this.emails().find((email) => email.primary);
  });
  protected readonly isEmailsLoading = this.#store.selectSignal(AccountSettingsSelectors.isEmailsLoading);

  dialogRef: DynamicDialogRef | null = null;

  addEmail() {
    this.dialogRef = this.#dialogService.open(AddEmailComponent, {
      width: '448px',
      focusOnShow: false,
      header: this.#translateService.instant('settings.accountSettings.connectedEmails.dialog.title'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  resendConfirmation(emailId: string) {
    if (this.currentUser()?.id) {
      this.#accountSettingsService.resendConfirmation(emailId, this.currentUser()!.id).subscribe();
    }
  }

  makePrimary(emailId: string) {
    if (this.currentUser()?.id) {
      this.#accountSettingsService.makePrimary(emailId).subscribe();
    }
  }

  deleteEmail(emailId: string) {
    const currentDeletingIds = this.deletingEmailIds();
    currentDeletingIds.add(emailId);
    this.deletingEmailIds.set(currentDeletingIds);

    this.#store.dispatch(new DeleteEmail(emailId)).subscribe({
      complete: () => {
        const updatedDeletingIds = this.deletingEmailIds();
        updatedDeletingIds.delete(emailId);
        this.deletingEmailIds.set(updatedDeletingIds);
      },
    });
  }
}
