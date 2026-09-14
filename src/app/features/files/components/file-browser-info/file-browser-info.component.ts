import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { UserSelectors } from '@osf/core/store/user/user.selectors';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';

import { FILE_BROWSER_INFO_ITEMS, FILE_BROWSER_READ_ONLY_INFO_ITEMS } from '../../constants';

@Component({
  selector: 'osf-file-browser-info',
  templateUrl: './file-browser-info.component.html',
  imports: [Button, TranslatePipe],
  styleUrl: './file-browser-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileBrowserInfoComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);
  readonly isProjectReadOnly = select(UserSelectors.isProjectReadOnly);

  readonly resourceType = (this.config.data as ResourceType) ?? ResourceType.Project;

  readonly infoItems = this.isProjectReadOnly() ? FILE_BROWSER_READ_ONLY_INFO_ITEMS : FILE_BROWSER_INFO_ITEMS;

  readonly filteredInfoItems = this.infoItems.filter((item) => item.showForResourceTypes.includes(this.resourceType));
}
