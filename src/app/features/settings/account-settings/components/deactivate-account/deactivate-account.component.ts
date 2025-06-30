import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AccountSettingsSelectors } from '../../store';
import { CancelDeactivationComponent } from '../cancel-deactivation/cancel-deactivation.component';
import { DeactivationWarningComponent } from '../deactivation-warning/deactivation-warning.component';

@Component({
  selector: 'osf-deactivate-account',
  imports: [Button, Message, TranslatePipe],
  templateUrl: './deactivate-account.component.html',
  styleUrl: './deactivate-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateAccountComponent {
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);

  protected accountSettings = select(AccountSettingsSelectors.getAccountSettings);

  deactivateAccount() {
    this.dialogService.open(DeactivationWarningComponent, {
      width: '552px',
      focusOnShow: false,
      header: this.translateService.instant('settings.accountSettings.deactivateAccount.dialog.deactivate.title'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  cancelDeactivation() {
    this.dialogService.open(CancelDeactivationComponent, {
      width: '552px',
      focusOnShow: false,
      header: this.translateService.instant('settings.accountSettings.deactivateAccount.dialog.undo.title'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }
}
