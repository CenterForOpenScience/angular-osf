import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputMask } from 'primeng/inputmask';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserSelectors } from '@osf/core/store/user';
import { InputLimits } from '@osf/shared/constants';
import { CustomConfirmationService, LoaderService, ToastService } from '@osf/shared/services';

import { AccountSettingsSelectors, DisableTwoFactorAuth, EnableTwoFactorAuth, VerifyTwoFactorAuth } from '../../store';

import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'osf-two-factor-auth',
  imports: [Button, Card, QRCodeComponent, ReactiveFormsModule, InputMask, TranslatePipe],
  templateUrl: './two-factor-auth.component.html',
  styleUrl: './two-factor-auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoFactorAuthComponent {
  private readonly actions = createDispatchMap({
    disableTwoFactorAuth: DisableTwoFactorAuth,
    enableTwoFactorAuth: EnableTwoFactorAuth,
    verifyTwoFactorAuth: VerifyTwoFactorAuth,
  });

  private readonly toastService = inject(ToastService);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly loaderService = inject(LoaderService);

  readonly accountSettings = select(AccountSettingsSelectors.getAccountSettings);
  readonly currentUser = select(UserSelectors.getCurrentUser);

  codeMaxLength = InputLimits.code.maxLength;

  dialogRef: DynamicDialogRef | null = null;

  qrCodeLink = computed(() => `otpauth://totp/OSF:${this.currentUser()?.id}?secret=${this.accountSettings()?.secret}`);

  verificationCode = new FormControl(null, {
    validators: [Validators.required],
  });

  configureTwoFactorAuth(): void {
    this.customConfirmationService.confirmAccept({
      headerKey: 'settings.accountSettings.twoFactorAuth.configure.title',
      messageKey: 'settings.accountSettings.twoFactorAuth.configure.description',
      acceptLabelKey: 'settings.accountSettings.common.buttons.configure',
      onConfirm: () => {
        this.loaderService.show();
        this.actions.enableTwoFactorAuth().subscribe(() => this.loaderService.hide());
      },
    });
  }

  openDisableDialog() {
    this.customConfirmationService.confirmAccept({
      headerKey: 'settings.accountSettings.twoFactorAuth.disable.title',
      messageKey: 'settings.accountSettings.twoFactorAuth.disable.message',
      acceptLabelKey: 'settings.accountSettings.common.buttons.disable',
      onConfirm: () => this.disableTwoFactor(),
    });
  }

  enableTwoFactor(): void {
    if (!this.verificationCode.value) {
      return;
    }

    this.loaderService.show();

    this.actions.verifyTwoFactorAuth(this.verificationCode.value).subscribe({
      next: () => {
        this.loaderService.hide();
        this.toastService.showSuccess('settings.accountSettings.twoFactorAuth.verification.success');
      },
    });
  }

  disableTwoFactor(): void {
    this.loaderService.show();
    this.actions.disableTwoFactorAuth().subscribe(() => {
      this.loaderService.hide();
      this.toastService.showSuccess('settings.accountSettings.twoFactorAuth.successDisable');
    });
  }
}
