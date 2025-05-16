import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DisableTwoFactorAuth } from '@osf/features/settings/account-settings/store/account-settings.actions';

@Component({
  selector: 'osf-verify-two-factor',
  imports: [Button, TranslatePipe],
  templateUrl: './verify-two-factor.component.html',
  styleUrl: './verify-two-factor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyTwoFactorComponent {
  #store = inject(Store);
  dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);

  disableTwoFactor() {
    this.#store.dispatch(DisableTwoFactorAuth);
    this.dialogRef.close();
  }
}
