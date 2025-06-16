import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AddonsSelectors, DeleteConfiguredAddon } from '@shared/stores/addons';

@Component({
  selector: 'osf-disconnect-addon-modal',
  imports: [Button, TranslatePipe],
  templateUrl: './disconnect-addon-modal.component.html',
  styleUrl: './disconnect-addon-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisconnectAddonModalComponent {
  private dialogConfig = inject(DynamicDialogConfig);
  private store = inject(Store);
  protected dialogRef = inject(DynamicDialogRef);
  protected addon = this.dialogConfig.data.addon;
  protected dialogMessage = this.dialogConfig.data.message || '';
  protected isSubmitting = select(AddonsSelectors.getDeleteStorageAddonSubmitting);
  protected selectedFolderName = select(AddonsSelectors.getSelectedFolderName);

  protected handleDisconnectAddonAccount(): void {
    if (!this.addon) return;

    this.store.dispatch(new DeleteConfiguredAddon(this.addon.id, this.addon.type)).subscribe({
      complete: () => {
        this.dialogRef.close({ success: true });
      },
    });
  }
}
