import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { OperationNames } from '@osf/shared/enums/operation-names.enum';
import { AddonOperationInvocationService } from '@osf/shared/services/addons/addon-operation-invocation.service';
import { AddonsSelectors, CreateAddonOperationInvocation } from '@osf/shared/stores/addons';

@Component({
  selector: 'osf-confirm-account-connection-modal',
  imports: [Button, TranslatePipe],
  templateUrl: './confirm-account-connection-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmAccountConnectionModalComponent {
  private readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly operationInvocationService = inject(AddonOperationInvocationService);
  readonly dialogRef = inject(DynamicDialogRef);

  dialogMessage = this.dialogConfig.data.message || '';
  readonly isSubmitting = select(AddonsSelectors.getOperationInvocationSubmitting);

  private readonly actions = createDispatchMap({ createAddonOperationInvocation: CreateAddonOperationInvocation });

  handleConnectAddonAccount(): void {
    const selectedAccount = this.dialogConfig.data.selectedAccount;
    const isGoogleDrive = this.dialogConfig.data.isGoogleDrive;

    if (!selectedAccount) return;

    if (isGoogleDrive) {
      this.dialogRef.close({ success: true });
      return;
    }

    const payload = this.operationInvocationService.createInitialOperationInvocationPayload(
      OperationNames.LIST_ROOT_ITEMS,
      selectedAccount
    );

    this.actions.createAddonOperationInvocation(payload).subscribe({
      complete: () => {
        this.dialogRef.close({ success: true });
      },
    });
  }
}
