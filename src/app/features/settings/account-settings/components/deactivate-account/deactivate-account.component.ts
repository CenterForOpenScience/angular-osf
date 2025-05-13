import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CancelDeactivationComponent } from '@osf/features/settings/account-settings/components/deactivate-account/components/cancel-deactivation/cancel-deactivation.component';
import { DeactivationWarningComponent } from '@osf/features/settings/account-settings/components/deactivate-account/components/deactivation-warning/deactivation-warning.component';
import { AccountSettingsSelectors } from '@osf/features/settings/account-settings/store/account-settings.selectors';

@Component({
  selector: 'osf-deactivate-account',
  imports: [Button, Message, NgOptimizedImage, TranslatePipe],
  templateUrl: './deactivate-account.component.html',
  styleUrl: './deactivate-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateAccountComponent {
  #store = inject(Store);
  dialogRef: DynamicDialogRef | null = null;
  readonly #dialogService = inject(DialogService);
  readonly #translateService = inject(TranslateService);
  protected accountSettings = this.#store.selectSignal(AccountSettingsSelectors.getAccountSettings);

  deactivateAccount() {
    this.dialogRef = this.#dialogService.open(DeactivationWarningComponent, {
      width: '552px',
      focusOnShow: false,
      header: this.#translateService.instant('settings.accountSettings.deactivateAccount.dialog.deactivate.title'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  cancelDeactivation() {
    this.dialogRef = this.#dialogService.open(CancelDeactivationComponent, {
      width: '552px',
      focusOnShow: false,
      header: this.#translateService.instant('settings.accountSettings.deactivateAccount.dialog.undo.title'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }
}
