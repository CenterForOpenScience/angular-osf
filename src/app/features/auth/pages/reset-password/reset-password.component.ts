import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';

import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { PasswordInputHintComponent } from '@osf/shared/components/password-input-hint/password-input-hint.component';
import { CustomValidators } from '@osf/shared/helpers/custom-form-validators.helper';
import { PASSWORD_REGEX } from '@osf/shared/helpers/password.helper';

import { ResetPasswordFormGroupType } from '../../models';

@Component({
  selector: 'osf-reset-password',
  imports: [Button, Password, ReactiveFormsModule, PasswordInputHintComponent, Message, TranslatePipe],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  isFormSubmitted = signal(false);
  passwordRegex = PASSWORD_REGEX;

  resetPasswordForm: ResetPasswordFormGroupType = this.fb.group(
    {
      newPassword: [
        '',
        [CustomValidators.requiredTrimmed(), Validators.minLength(8), Validators.pattern(this.passwordRegex)],
      ],
      confirmNewPassword: ['', CustomValidators.requiredTrimmed()],
    },
    {
      validators: CustomValidators.passwordMatchValidator('newPassword', 'confirmNewPassword'),
    }
  );

  get isMismatchError(): boolean {
    return (
      this.resetPasswordForm.get('confirmNewPassword')?.dirty &&
      this.resetPasswordForm.get('newPassword')?.dirty &&
      this.resetPasswordForm.errors?.['passwordMismatch']
    );
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const userId = this.route.snapshot.params['userId'];
    const token = this.route.snapshot.params['token'];
    const newPassword = this.resetPasswordForm.getRawValue().newPassword;

    this.authService.resetPassword(userId, token, newPassword).subscribe(() => {
      this.isFormSubmitted.set(true);
    });
  }

  backToSignIn() {
    this.authService.navigateToSignIn();
  }
}
