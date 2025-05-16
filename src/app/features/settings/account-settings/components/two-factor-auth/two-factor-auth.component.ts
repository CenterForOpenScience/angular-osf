import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserSelectors } from '@core/store/user/user.selectors';
import {
  ConfigureTwoFactorComponent,
  VerifyTwoFactorComponent,
} from '@osf/features/settings/account-settings/components/two-factor-auth/components';
import { AccountSettings } from '@osf/features/settings/account-settings/models/osf-models/account-settings.model';
import {
  DisableTwoFactorAuth,
  SetAccountSettings,
} from '@osf/features/settings/account-settings/store/account-settings.actions';
import { AccountSettingsSelectors } from '@osf/features/settings/account-settings/store/account-settings.selectors';

import { AccountSettingsService } from '../../services';

import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'osf-two-factor-auth',
  imports: [Button, QRCodeComponent, ReactiveFormsModule, InputText, TranslatePipe],
  templateUrl: './two-factor-auth.component.html',
  styleUrl: './two-factor-auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoFactorAuthComponent {
  #store = inject(Store);
  dialogRef: DynamicDialogRef | null = null;
  readonly #dialogService = inject(DialogService);
  readonly #accountSettingsService = inject(AccountSettingsService);
  readonly #translateService = inject(TranslateService);
  readonly accountSettings = this.#store.selectSignal(AccountSettingsSelectors.getAccountSettings);
  readonly currentUser = this.#store.selectSignal(UserSelectors.getCurrentUser);

  qrCodeLink = computed(() => {
    return `otpauth://totp/OSF:${this.currentUser()?.email}?secret=${this.accountSettings()?.secret}`;
  });

  verificationCode = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  errorMessage = signal('');

  configureTwoFactorAuth(): void {
    this.dialogRef = this.#dialogService.open(ConfigureTwoFactorComponent, {
      width: '520px',
      focusOnShow: false,
      header: this.#translateService.instant('settings.accountSettings.twoFactorAuth.dialog.configure.title'),
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: this.accountSettings(),
    });
  }

  openDisableDialog() {
    this.dialogRef = this.#dialogService.open(VerifyTwoFactorComponent, {
      width: '520px',
      focusOnShow: false,
      header: this.#translateService.instant('settings.accountSettings.twoFactorAuth.dialog.disable.title'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  enableTwoFactor(): void {
    this.#accountSettingsService.updateSettings({ two_factor_verification: this.verificationCode.value }).subscribe({
      next: (response: AccountSettings) => {
        this.#store.dispatch(new SetAccountSettings(response));
      },
      error: (error: HttpErrorResponse) => {
        if (error.error?.errors?.[0]?.detail) {
          this.errorMessage.set(error.error.errors[0].detail);
        } else {
          this.errorMessage.set(
            this.#translateService.instant('settings.accountSettings.twoFactorAuth.verification.error')
          );
        }
      },
    });
  }

  disableTwoFactor(): void {
    this.#store.dispatch(DisableTwoFactorAuth);
  }
}
