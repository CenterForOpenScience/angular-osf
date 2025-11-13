import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';

import { FILE_BROWSER_INFO_ITEMS } from '../../constants';

@Component({
  selector: 'osf-file-browser-info',
  imports: [Button, TranslatePipe],
  templateUrl: './file-browser-info.component.html',
  styleUrl: './file-browser-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileBrowserInfoComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);

  readonly resourceType = computed(() => (this.config.data as ResourceType) || ResourceType.Project);

  readonly infoItems = FILE_BROWSER_INFO_ITEMS;

  readonly filteredInfoItems = computed(() => {
    return this.infoItems.filter((item) => item.showForResourceTypes.includes(this.resourceType()));
  });
}
