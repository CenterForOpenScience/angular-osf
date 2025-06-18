import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { OperationNames } from '@osf/features/project/addons/enums';
import { AddonOperationInvocationService } from '@shared/services';
import { AddonsSelectors, CreateAddonOperationInvocation } from '@shared/stores/addons';

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
  protected dialogRef = inject(DynamicDialogRef);
  protected dialogMessage = this.dialogConfig.data.message || '';
  protected isSubmitting = select(AddonsSelectors.getOperationInvocationSubmitting);

  protected actions = createDispatchMap({
    createAddonOperationInvocation: CreateAddonOperationInvocation,
  });

  protected handleConnectAddonAccount(): void {
    const selectedAccount = this.dialogConfig.data.selectedAccount;
    if (!selectedAccount) return;

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
