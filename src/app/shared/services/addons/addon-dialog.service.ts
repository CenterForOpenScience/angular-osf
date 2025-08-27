import { TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ConfirmAccountConnectionModalComponent } from '@osf/features/project/addons/components/confirm-account-connection-modal/confirm-account-connection-modal.component';
import { DisconnectAddonModalComponent } from '@osf/features/project/addons/components/disconnect-addon-modal/disconnect-addon-modal.component';
import { AuthorizedAccountModel, ConfiguredStorageAddonModel } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class AddonDialogService {
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);

  openDisconnectDialog(addon: ConfiguredStorageAddonModel): Observable<{ success: boolean }> {
    const dialogRef = this.dialogService.open(DisconnectAddonModalComponent, {
      focusOnShow: false,
      header: this.translateService.instant('settings.addons.configureAddon.disconnect', {
        addonName: addon.externalServiceName,
      }),
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        message: this.translateService.instant('settings.addons.configureAddon.disconnectMessage'),
        addon,
      },
    });

    return dialogRef.onClose;
  }

  openConfirmAccountConnectionDialog(selectedAccount: AuthorizedAccountModel): Observable<{ success: boolean }> {
    const dialogRef = this.dialogService.open(ConfirmAccountConnectionModalComponent, {
      focusOnShow: false,
      header: this.translateService.instant('settings.addons.connectAddon.confirmAccount'),
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        message: this.translateService.instant('settings.addons.connectAddon.connectAccount', {
          accountName: selectedAccount.displayName,
        }),
        selectedAccount,
      },
    });

    return dialogRef.onClose;
  }
}
