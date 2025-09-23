import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AddonType } from '@osf/shared/enums';
import { getAddonTypeString } from '@osf/shared/helpers';
import { AddonsSelectors, DeleteConfiguredAddon } from '@osf/shared/stores';

@Component({
  selector: 'osf-disconnect-addon-modal',
  imports: [Button, TranslatePipe],
  templateUrl: './disconnect-addon-modal.component.html',
  styleUrl: './disconnect-addon-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisconnectAddonModalComponent {
  private dialogConfig = inject(DynamicDialogConfig);
  dialogRef = inject(DynamicDialogRef);
  addon = this.dialogConfig.data.addon;
  dialogMessage = this.dialogConfig.data.message || '';
  isSubmitting = select(AddonsSelectors.getDeleteStorageAddonSubmitting);
  selectedFolder = select(AddonsSelectors.getSelectedStorageItem);
  selectedItemLabel = computed(() => {
    const addonType = getAddonTypeString(this.addon);
    return addonType === AddonType.LINK
      ? 'settings.addons.configureAddon.linkedItem'
      : 'settings.addons.configureAddon.selectedFolder';
  });
  actions = createDispatchMap({
    deleteConfiguredAddon: DeleteConfiguredAddon,
  });

  handleDisconnectAddonAccount(): void {
    if (!this.addon) return;

    this.actions.deleteConfiguredAddon(this.addon.id, this.addon.type).subscribe({
      complete: () => this.dialogRef.close({ success: true }),
    });
  }
}
