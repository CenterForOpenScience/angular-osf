import { Store } from '@ngxs/store';

import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserSelectors } from '@core/store/user/user.selectors';
import { ConfigureTwoFactorComponent } from '@osf/features/settings/account-settings/components/two-factor-auth/components/configure-two-factor/configure-two-factor.component';
import { VerifyTwoFactorComponent } from '@osf/features/settings/account-settings/components/two-factor-auth/components/verify-two-factor/verify-two-factor.component';
import { AccountSettings } from '@osf/features/settings/account-settings/models/osf-entities/account-settings.entity';
import { AccountSettingsService } from '@osf/features/settings/account-settings/services/account-settings.service';
import {
  DisableTwoFactorAuth,
  SetAccountSettings,
} from '@osf/features/settings/account-settings/store/account-settings.actions';
import { AccountSettingsSelectors } from '@osf/features/settings/account-settings/store/account-settings.selectors';

import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'osf-two-factor-auth',
  imports: [Button, QRCodeComponent, ReactiveFormsModule, InputText],
  templateUrl: './two-factor-auth.component.html',
  styleUrl: './two-factor-auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoFactorAuthComponent {
  #store = inject(Store);
  dialogRef: DynamicDialogRef | null = null;
  readonly #dialogService = inject(DialogService);
  readonly #accountSettingsService = inject(AccountSettingsService);
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

  // open dialog
  configureTwoFactorAuth(): void {
    this.dialogRef = this.#dialogService.open(ConfigureTwoFactorComponent, {
      width: '520px',
      focusOnShow: false,
      header: 'Configure',
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
      header: 'Disable',
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
          this.errorMessage.set('Verification code is invalid. Please try again.');
        }
      },
    });
  }

  disableTwoFactor(): void {
    this.#store.dispatch(DisableTwoFactorAuth);
  }
}
