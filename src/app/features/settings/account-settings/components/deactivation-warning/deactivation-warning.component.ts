import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'osf-deactivation-warning',
  imports: [Button, TranslatePipe],
  templateUrl: './deactivation-warning.component.html',
  styleUrl: './deactivation-warning.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivationWarningComponent {
  dialogRef = inject(DynamicDialogRef);

  deactivateAccount(): void {
    this.dialogRef.close(true);
  }
}
