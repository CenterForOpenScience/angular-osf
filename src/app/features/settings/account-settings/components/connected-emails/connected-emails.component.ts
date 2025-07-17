import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';

import { filter, finalize } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { UserSelectors } from '@osf/core/store/user';
import { ReadonlyInputComponent } from '@osf/shared/components';
import { CustomConfirmationService, LoaderService, ToastService } from '@osf/shared/services';
import { IS_SMALL } from '@osf/shared/utils';

import { AccountEmail } from '../../models';
import { AccountSettingsSelectors, DeleteEmail, MakePrimary, ResendConfirmation } from '../../store';
import { ConfirmationSentDialogComponent } from '../confirmation-sent-dialog/confirmation-sent-dialog.component';
import { AddEmailComponent } from '../';

@Component({
  selector: 'osf-connected-emails',
  imports: [Button, Skeleton, Card, TranslatePipe, ReadonlyInputComponent],
  templateUrl: './connected-emails.component.html',
  styleUrl: './connected-emails.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectedEmailsComponent {
  readonly isSmall = toSignal(inject(IS_SMALL));

  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

  protected readonly currentUser = select(UserSelectors.getCurrentUser);
  protected readonly emails = select(AccountSettingsSelectors.getEmails);
  protected readonly isEmailsLoading = select(AccountSettingsSelectors.isEmailsLoading);

  private readonly actions = createDispatchMap({
    resendConfirmation: ResendConfirmation,
    deleteEmail: DeleteEmail,
    makePrimary: MakePrimary,
  });

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
    this.dialogService
      .open(AddEmailComponent, {
        width: '448px',
        focusOnShow: false,
        header: this.translateService.instant('settings.accountSettings.connectedEmails.dialog.title'),
        closeOnEscape: true,
        modal: true,
        closable: true,
      })
      .onClose.pipe(filter((email: string) => !!email))
      .subscribe((email) => this.showConfirmationSentDialog(email));
  }

  showConfirmationSentDialog(email: string) {
    this.dialogService.open(ConfirmationSentDialogComponent, {
      width: '448px',
      focusOnShow: false,
      header: this.translateService.instant('settings.accountSettings.connectedEmails.confirmationSentDialog.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: email,
    });
  }

  resendConfirmation(email: AccountEmail) {
    this.customConfirmationService.confirmAccept({
      headerKey: 'settings.accountSettings.connectedEmails.resendDialog.header',
      messageParams: { email: email.emailAddress },
      messageKey: 'settings.accountSettings.connectedEmails.resendDialog.message',
      acceptLabelKey: 'settings.accountSettings.connectedEmails.buttons.resend',
      onConfirm: () => {
        if (this.currentUser()?.id) {
          this.loaderService.show();

          this.actions
            .resendConfirmation(email.id, this.currentUser()!.id)
            .pipe(
              finalize(() => this.loaderService.hide()),
              takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.toastService.showSuccess('settings.accountSettings.connectedEmails.successResend'));
        }
      },
    });
  }

  makePrimary(email: AccountEmail) {
    this.customConfirmationService.confirmAccept({
      headerKey: 'settings.accountSettings.connectedEmails.makePrimaryDialog.header',
      messageParams: { email: email.emailAddress },
      messageKey: 'settings.accountSettings.connectedEmails.makePrimaryDialog.message',
      acceptLabelKey: 'settings.accountSettings.connectedEmails.buttons.makePrimary',
      onConfirm: () => {
        if (this.currentUser()?.id) {
          this.loaderService.show();

          this.actions
            .makePrimary(email.id)
            .pipe(
              finalize(() => this.loaderService.hide()),
              takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() =>
              this.toastService.showSuccess('settings.accountSettings.connectedEmails.successMakePrimary')
            );
        }
      },
    });
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
    this.loaderService.show();

    this.actions.deleteEmail(emailId).subscribe({
      complete: () => {
        this.loaderService.hide();
        this.toastService.showSuccess('settings.accountSettings.connectedEmails.successDelete');
      },
    });
  }
}
