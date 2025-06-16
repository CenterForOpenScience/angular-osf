import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { OperationInvocationRequestJsonApi } from '@shared/models';
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
  private store = inject(Store);
  protected dialogRef = inject(DynamicDialogRef);
  protected dialogMessage = this.dialogConfig.data.message || '';
  protected isSubmitting = select(AddonsSelectors.getOperationInvocationSubmitting);

  protected handleConnectAddonAccount(): void {
    const selectedAccount = this.dialogConfig.data.selectedAccount;
    if (!selectedAccount) return;

    const payload: OperationInvocationRequestJsonApi = {
      data: {
        type: 'addon-operation-invocations',
        attributes: {
          invocation_status: null,
          operation_name: 'list_root_items',
          operation_kwargs: {},
          operation_result: {},
          created: null,
          modified: null,
        },
        relationships: {
          thru_account: {
            data: {
              type: selectedAccount.type,
              id: selectedAccount.id,
            },
          },
        },
      },
    };

    this.store.dispatch(new CreateAddonOperationInvocation(payload)).subscribe({
      complete: () => {
        this.dialogRef.close({ success: true });
      },
    });
  }
}
