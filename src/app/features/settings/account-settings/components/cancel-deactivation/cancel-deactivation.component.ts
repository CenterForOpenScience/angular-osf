import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CancelDeactivationRequest } from '../../store';

@Component({
  selector: 'osf-cancel-deactivation',
  imports: [Button, TranslatePipe],
  templateUrl: './cancel-deactivation.component.html',
  styleUrl: './cancel-deactivation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelDeactivationComponent {
  private readonly action = createDispatchMap({ cancelDeactivationRequest: CancelDeactivationRequest });
  readonly dialogRef = inject(DynamicDialogRef);

  cancelDeactivation(): void {
    this.action.cancelDeactivationRequest();
    this.dialogRef.close();
  }
}
