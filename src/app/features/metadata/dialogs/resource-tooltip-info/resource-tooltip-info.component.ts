import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'osf-resource-tooltip-info',
  imports: [Button, TranslatePipe],
  templateUrl: './resource-tooltip-info.component.html',
  styleUrl: './resource-tooltip-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceInfoTooltipComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly resourceName = 'project';
}
