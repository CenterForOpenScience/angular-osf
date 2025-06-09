import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Skeleton } from 'primeng/skeleton';

import { finalize } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { UserSelectors } from '@osf/core/store/user';
import { IS_XSMALL } from '@osf/shared/utils';

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
  readonly #store = inject(Store);
  readonly #accountSettingsService = inject(AccountSettingsService);
  readonly #dialogService = inject(DialogService);
  readonly #translateService = inject(TranslateService);
  readonly isMobile = toSignal(inject(IS_XSMALL));
  readonly #destroyRef = inject(DestroyRef);

  protected readonly currentUser = this.#store.selectSignal(UserSelectors.getCurrentUser);
  protected readonly emails = this.#store.selectSignal(AccountSettingsSelectors.getEmails);
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
      this.resendingEmailIds.set(new Set([...this.resendingEmailIds(), emailId]));

      this.#accountSettingsService
        .resendConfirmation(emailId, this.currentUser()!.id)
        .pipe(
          finalize(() => {
            const currentIds = this.resendingEmailIds();
            const updatedIds = new Set([...currentIds].filter((id) => id !== emailId));
            this.resendingEmailIds.set(updatedIds);
          }),
          takeUntilDestroyed(this.#destroyRef)
        )
        .subscribe();
    }
  }

  makePrimary(emailId: string) {
    if (this.currentUser()?.id) {
      this.makingPrimaryIds.set(new Set([...this.makingPrimaryIds(), emailId]));

      this.#store
        .dispatch(new MakePrimary(emailId))
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => {
          const currentIds = this.makingPrimaryIds();
          const updatedIds = new Set([...currentIds].filter((id) => id !== emailId));
          this.makingPrimaryIds.set(updatedIds);
        });
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
