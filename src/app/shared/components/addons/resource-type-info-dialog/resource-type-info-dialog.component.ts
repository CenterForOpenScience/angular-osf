import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'osf-resource-type-info-dialog',
  imports: [TranslatePipe, Button],
  templateUrl: './resource-type-info-dialog.component.html',
  styleUrl: './resource-type-info-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceTypeInfoDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly REDIRECT_URL = 'https://help.osf.io/article/570-resource-types-in-osf';
}
