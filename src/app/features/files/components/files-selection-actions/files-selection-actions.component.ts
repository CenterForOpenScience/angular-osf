import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { FileModel } from '@osf/shared/models';

@Component({
  selector: 'osf-files-selection-actions',
  imports: [Button, TranslatePipe],
  templateUrl: './files-selection-actions.component.html',
  styleUrl: './files-selection-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesSelectionActionsComponent {
  selectedFiles = input<FileModel[]>([]);
  canUpdateFiles = input<boolean>(true);
  copySelected = output<void>();
  moveSelected = output<void>();
  deleteSelected = output<void>();
  clearSelection = output<void>();
}
