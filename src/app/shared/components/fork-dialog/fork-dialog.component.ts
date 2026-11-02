import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';

@Component({
  selector: 'osf-fork-dialog',
  imports: [TranslatePipe, Button],
  templateUrl: './fork-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForkDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly messageKey =
    this.config.data?.resourceType === CurrentResourceType.Registrations
      ? 'project.overview.dialog.fork.messageRegistration'
      : 'project.overview.dialog.fork.messageProject';
}
