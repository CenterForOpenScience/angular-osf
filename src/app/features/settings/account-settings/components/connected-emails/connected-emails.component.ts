import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { filter, finalize, throttleTime } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { DeleteEmail, GetEmails, MakePrimary, ResendConfirmation, UserEmailsSelectors } from '@core/store/user-emails';
import { UserSelectors } from '@osf/core/store/user';
import { ReadonlyInputComponent } from '@osf/shared/components/readonly-input/readonly-input.component';
import { IS_SMALL } from '@osf/shared/helpers/breakpoints.tokens';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { AccountEmail } from '../../models';
import { AddEmailComponent } from '../add-email/add-email.component';
import { ConfirmationSentDialogComponent } from '../confirmation-sent-dialog/confirmation-sent-dialog.component';

@Component({
  selector: 'osf-connected-emails',
  imports: [Button, Skeleton, Card, TranslatePipe, ReadonlyInputComponent],
  templateUrl: './connected-emails.component.html',
  styleUrl: './connected-emails.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectedEmailsComponent {
  readonly isSmall = toSignal(inject(IS_SMALL));

  private readonly customDialogService = inject(CustomDialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

  readonly currentUser = select(UserSelectors.getCurrentUser);
  readonly emails = select(UserEmailsSelectors.getEmails);
  readonly isEmailsLoading = select(UserEmailsSelectors.isEmailsLoading);
  readonly isEmailsSubmitting = select(UserEmailsSelectors.isEmailsSubmitting);

  private readonly actions = createDispatchMap({
    getEmails: GetEmails,
    resendConfirmation: ResendConfirmation,
    deleteEmail: DeleteEmail,
    makePrimary: MakePrimary,
  });

  readonly unconfirmedEmails = computed(() => {
    return this.emails().filter((email) => !email.confirmed && !email.primary);
  });
  readonly confirmedEmails = computed(() => {
    return this.emails().filter((email) => email.confirmed && !email.primary);
  });
  readonly primaryEmail = computed(() => {
    return this.emails().find((email) => email.primary);
  });

  addEmail() {
    this.customDialogService
      .open(AddEmailComponent, {
        header: 'settings.accountSettings.connectedEmails.dialog.title',
        width: '448px',
      })
      .onClose.pipe(filter((email: string) => !!email))
      .subscribe((email) => this.showConfirmationSentDialog(email));
  }

  showConfirmationSentDialog(email: string) {
    this.customDialogService.open(ConfirmationSentDialogComponent, {
      header: 'settings.accountSettings.connectedEmails.confirmationSentDialog.header',
      width: '448px',
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
            .resendConfirmation(email.id)
            .pipe(
              throttleTime(2000),
              finalize(() => this.loaderService.hide()),
              takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
              this.toastService.showSuccess('settings.accountSettings.connectedEmails.successResend');
              this.actions.getEmails();
            });
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
