import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';

import { filter } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CustomDialogService, LoaderService, ToastService } from '@osf/shared/services';

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
  private readonly customDialogService = inject(CustomDialogService);
  private readonly toastService = inject(ToastService);
  private readonly loaderService = inject(LoaderService);

  private readonly action = createDispatchMap({
    cancelDeactivationRequest: CancelDeactivationRequest,
    deactivateAccount: DeactivateAccount,
  });

  accountSettings = select(AccountSettingsSelectors.getAccountSettings);

  deactivateAccount() {
    this.customDialogService
      .open(DeactivationWarningComponent, {
        header: 'settings.accountSettings.deactivateAccount.dialog.deactivate.title',
        width: '552px',
      })
      .onClose.pipe(filter((res: boolean) => res))
      .subscribe(() => {
        this.loaderService.show();

        this.action.deactivateAccount().subscribe(() => {
          this.toastService.showSuccess('settings.accountSettings.deactivateAccount.successDeactivation');
          this.loaderService.hide();
        });
      });
  }

  cancelDeactivation() {
    this.customDialogService
      .open(CancelDeactivationComponent, {
        header: 'settings.accountSettings.deactivateAccount.dialog.undo.title',
        width: '552px',
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
