import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'osf-request-access-error-dialog',
  imports: [TranslatePipe, Button],
  templateUrl: './request-access-error-dialog.component.html',
  styleUrl: './request-access-error-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestAccessErrorDialogComponent {
  dialogRef = inject(DynamicDialogRef);
}
