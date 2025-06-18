import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Skeleton } from 'primeng/skeleton';

import { finalize } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { UserSelectors } from '@osf/core/store/user';
import { CustomConfirmationService } from '@osf/shared/services';
import { IS_SMALL } from '@osf/shared/utils';

import { AccountEmail } from '../../models';
import { AccountSettingsService } from '../../services';
import { AccountSettingsSelectors, DeleteEmail, MakePrimary } from '../../store';
import { AddEmailComponent } from '../add-email/add-email.component';

@Component({
  selector: 'osf-connected-emails',
  imports: [Button, ProgressSpinner, Skeleton, TranslatePipe],
  templateUrl: './connected-emails.component.html',
  styleUrl: './connected-emails.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectedEmailsComponent {
  readonly isSmall = toSignal(inject(IS_SMALL));

  private readonly accountSettingsService = inject(AccountSettingsService);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customConfirmationService = inject(CustomConfirmationService);

  protected readonly currentUser = select(UserSelectors.getCurrentUser);
  protected readonly emails = select(AccountSettingsSelectors.getEmails);
  protected readonly isEmailsLoading = select(AccountSettingsSelectors.isEmailsLoading);

  private readonly actions = createDispatchMap({
    deleteEmail: DeleteEmail,
    makePrimary: MakePrimary,
  });

  protected readonly deletingEmailIds = signal<Set<string>>(new Set());
  protected readonly resendingEmailIds = signal<Set<string>>(new Set());
  protected readonly makingPrimaryIds = signal<Set<string>>(new Set());

  protected readonly unconfirmedEmails = computed(() => {
    return this.emails().filter((email) => !email.confirmed && !email.primary);
  });
  protected readonly confirmedEmails = computed(() => {
    return this.emails().filter((email) => email.confirmed && !email.primary);
  });
  protected readonly primaryEmail = computed(() => {
    return this.emails().find((email) => email.primary);
  });

  addEmail() {
    this.dialogService.open(AddEmailComponent, {
      width: '448px',
      focusOnShow: false,
      header: this.translateService.instant('settings.accountSettings.connectedEmails.dialog.title'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  resendConfirmation(emailId: string) {
    if (this.currentUser()?.id) {
      this.resendingEmailIds.set(new Set([...this.resendingEmailIds(), emailId]));

      this.accountSettingsService
        .resendConfirmation(emailId, this.currentUser()!.id)
        .pipe(
          finalize(() => {
            const currentIds = this.resendingEmailIds();
            const updatedIds = new Set([...currentIds].filter((id) => id !== emailId));
            this.resendingEmailIds.set(updatedIds);
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  makePrimary(emailId: string) {
    if (this.currentUser()?.id) {
      this.makingPrimaryIds.set(new Set([...this.makingPrimaryIds(), emailId]));

      this.actions
        .makePrimary(emailId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          const currentIds = this.makingPrimaryIds();
          const updatedIds = new Set([...currentIds].filter((id) => id !== emailId));
          this.makingPrimaryIds.set(updatedIds);
        });
    }
  }

  openConfirmDeleteEmail(email: AccountEmail) {
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.accountSettings.connectedEmails.deleteDialog.header',
      messageParams: { name: email.emailAddress },
      messageKey: 'settings.accountSettings.connectedEmails.deleteDialog.message',
      onConfirm: () => this.deleteEmails(email.id),
    });
  }

  deleteEmails(emailId: string) {
    const currentDeletingIds = this.deletingEmailIds();
    currentDeletingIds.add(emailId);
    this.deletingEmailIds.set(currentDeletingIds);

    this.actions.deleteEmail(emailId).subscribe({
      complete: () => {
        const updatedDeletingIds = this.deletingEmailIds();
        updatedDeletingIds.delete(emailId);
        this.deletingEmailIds.set(updatedDeletingIds);
      },
    });
  }
}
