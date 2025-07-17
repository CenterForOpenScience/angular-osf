import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';

import { filter } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LoaderService, ToastService } from '@osf/shared/services';

import { AccountSettingsSelectors, CancelDeactivationRequest, DeactivateAccount } from '../../store';
import { CancelDeactivationComponent } from '../cancel-deactivation/cancel-deactivation.component';
import { DeactivationWarningComponent } from '../deactivation-warning/deactivation-warning.component';

@Component({
  selector: 'osf-deactivate-account',
  imports: [Button, Card, Message, TranslatePipe],
  templateUrl: './deactivate-account.component.html',
  styleUrl: './deactivate-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateAccountComponent {
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly toastService = inject(ToastService);
  private readonly loaderService = inject(LoaderService);

  private readonly action = createDispatchMap({
    cancelDeactivationRequest: CancelDeactivationRequest,
    deactivateAccount: DeactivateAccount,
  });

  protected accountSettings = select(AccountSettingsSelectors.getAccountSettings);

  deactivateAccount() {
    this.dialogService
      .open(DeactivationWarningComponent, {
        width: '552px',
        focusOnShow: false,
        header: this.translateService.instant('settings.accountSettings.deactivateAccount.dialog.deactivate.title'),
        closeOnEscape: true,
        modal: true,
        closable: true,
      })
      .onClose.pipe(filter((res: boolean) => res))
      .subscribe(() => {
        this.loaderService.show();

        // [NS] Hidden to avoid issues with development
        // this.action.deactivateAccount().subscribe(() => {
        this.toastService.showSuccess('settings.accountSettings.deactivateAccount.successDeactivation');
        this.loaderService.hide();
        // });
      });
  }

  cancelDeactivation() {
    this.dialogService
      .open(CancelDeactivationComponent, {
        width: '552px',
        focusOnShow: false,
        header: this.translateService.instant('settings.accountSettings.deactivateAccount.dialog.undo.title'),
        closeOnEscape: true,
        modal: true,
        closable: true,
      })
      .onClose.pipe(filter((res: boolean) => res))
      .subscribe(() => {
        this.loaderService.show();

        this.action.cancelDeactivationRequest().subscribe(() => {
          this.toastService.showSuccess('settings.accountSettings.deactivateAccount.successCancelDeactivation');
          this.loaderService.hide();
        });
      });
  }
}
