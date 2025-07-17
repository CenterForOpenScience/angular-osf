import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'osf-cancel-deactivation',
  imports: [Button, TranslatePipe],
  templateUrl: './cancel-deactivation.component.html',
  styleUrl: './cancel-deactivation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelDeactivationComponent {
  readonly dialogRef = inject(DynamicDialogRef);

  cancelDeactivation(): void {
    this.dialogRef.close(true);
  }
}
