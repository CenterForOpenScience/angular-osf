import { TranslatePipe } from '@ngx-translate/core';

import { DialogModule } from 'primeng/dialog';

import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'osf-file-upload-dialog',
  imports: [DialogModule, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './file-upload-dialog.component.html',
  styleUrl: './file-upload-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadDialogComponent {
  visible = model<boolean>(false);
  fileName = input<string>('');
  progress = input<number>(0);
}
