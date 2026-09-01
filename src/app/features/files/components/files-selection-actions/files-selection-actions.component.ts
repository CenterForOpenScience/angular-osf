import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'osf-files-selection-actions',
  imports: [Button, Tooltip, TranslatePipe],
  templateUrl: './files-selection-actions.component.html',
  styleUrl: './files-selection-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesSelectionActionsComponent {
  selectedFilesCount = input<number>(0);
  canUpdateFiles = input<boolean>(true);
  hasViewOnly = input<boolean>(false);
  isProjectReadOnly = input<boolean>(false);
  copySelected = output<void>();
  moveSelected = output<void>();
  deleteSelected = output<void>();
  clearSelection = output<void>();
}
