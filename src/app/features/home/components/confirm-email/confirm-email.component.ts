import { Store } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { VerifyEmail } from '@osf/features/settings/account-settings/store/account-settings.actions';

@Component({
  selector: 'osf-confirm-email',
  imports: [Button, FormsModule, TranslateModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent {
  readonly #store = inject(Store);
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);
  readonly #router = inject(Router);

  verifyEmail() {
    this.#store.dispatch(new VerifyEmail(this.config.data.userId, this.config.data.emailId));
    this.#router.navigate(['/settings/account']);
  }
}
