import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { BYTES_IN_MB, FILE_TYPES } from '../../constants';

@Component({
  selector: 'osf-bulk-upload',
  imports: [Button, FileUpload, TranslatePipe],
  templateUrl: './bulk-upload.component.html',
  styleUrl: './bulk-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkUploadComponent {
  maxSize = input(1 * BYTES_IN_MB);
  acceptTypes = input(FILE_TYPES.CSV);
}
