import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { OperationNames } from '@osf/shared/enums/operation-names.enum';
import { AddonOperationInvocationService } from '@osf/shared/services/addons/addon-operation-invocation.service';
import { AddonsSelectors, CreateAddonOperationInvocation } from '@osf/shared/stores/addons';

@Component({
  selector: 'osf-confirm-account-connection-modal',
  imports: [Button, ReactiveFormsModule, TranslatePipe],
  templateUrl: './confirm-account-connection-modal.component.html',
  styleUrl: './confirm-account-connection-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmAccountConnectionModalComponent {
  private dialogConfig = inject(DynamicDialogConfig);
  private operationInvocationService = inject(AddonOperationInvocationService);
  dialogRef = inject(DynamicDialogRef);
  dialogMessage = this.dialogConfig.data.message || '';
  isSubmitting = select(AddonsSelectors.getOperationInvocationSubmitting);

  actions = createDispatchMap({
    createAddonOperationInvocation: CreateAddonOperationInvocation,
  });

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
