import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AddonType } from '@osf/shared/enums/addon-type.enum';
import { getAddonTypeString } from '@osf/shared/helpers/addon-type.helper';
import { AddonsSelectors, DeleteConfiguredAddon } from '@osf/shared/stores/addons';

@Component({
  selector: 'osf-disconnect-addon-modal',
  imports: [Button, TranslatePipe],
  templateUrl: './disconnect-addon-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisconnectAddonModalComponent {
  private readonly dialogConfig = inject(DynamicDialogConfig);
  readonly dialogRef = inject(DynamicDialogRef);

  addon = this.dialogConfig.data.addon;
  dialogMessage = this.dialogConfig.data.message || '';

  private readonly actions = createDispatchMap({ deleteConfiguredAddon: DeleteConfiguredAddon });

  readonly isSubmitting = select(AddonsSelectors.getDeleteStorageAddonSubmitting);
  readonly selectedFolder = select(AddonsSelectors.getSelectedStorageItem);

  readonly selectedItemLabel = computed(() => {
    const addonType = getAddonTypeString(this.addon);
    return addonType === AddonType.LINK
      ? 'settings.addons.configureAddon.linkedItem'
      : 'settings.addons.configureAddon.selectedFolder';
  });

  handleDisconnectAddonAccount(): void {
    if (!this.addon) return;

    this.actions.deleteConfiguredAddon(this.addon.id, this.addon.type).subscribe({
      complete: () => this.dialogRef.close({ success: true }),
    });
  }
}
