import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CancelDeactivationRequest } from '@osf/features/settings/account-settings/store/account-settings.actions';

@Component({
  selector: 'osf-cancel-deactivation',
  imports: [Button, TranslatePipe],
  templateUrl: './cancel-deactivation.component.html',
  styleUrl: './cancel-deactivation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelDeactivationComponent {
  #store = inject(Store);
  dialogRef = inject(DynamicDialogRef);

  cancelDeactivation(): void {
    this.#store.dispatch(CancelDeactivationRequest);
    this.dialogRef.close();
  }
}
