import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AccountSettings } from '@osf/features/settings/account-settings/models';
import { EnableTwoFactorAuth } from '@osf/features/settings/account-settings/store';

@Component({
  selector: 'osf-configure-two-factor',
  imports: [Button, FormsModule, TranslatePipe],
  templateUrl: './configure-two-factor.component.html',
  styleUrl: './configure-two-factor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureTwoFactorComponent {
  #store = inject(Store);
  dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);

  enableTwoFactor(): void {
    const settings = this.config.data as AccountSettings;
    settings.twoFactorEnabled = true;
    this.#store.dispatch(EnableTwoFactorAuth);
    this.dialogRef.close();
  }
}
