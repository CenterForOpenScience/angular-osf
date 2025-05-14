import { TranslateModule } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Password } from 'primeng/password';

import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PasswordInputHintComponent } from '@shared/components/password-input-hint/password-input-hint.component';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

import { PASSWORD_REGEX, passwordMatchValidator } from '../sign-up/sign-up.helper';

import { ResetPasswordFormGroupType } from './reset-password-form-group.type';

@Component({
  selector: 'osf-reset-password',
  standalone: true,
  imports: [Button, Password, ReactiveFormsModule, RouterLink, PasswordInputHintComponent, TranslateModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  #fb = inject(FormBuilder);
  #isMobile$ = inject(IS_XSMALL);
  passwordRegex = PASSWORD_REGEX;
  resetPasswordForm: ResetPasswordFormGroupType = this.#fb.group(
    {
      newPassword: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
      confirmNewPassword: ['', Validators.required],
    },
    {
      validators: passwordMatchValidator(),
    }
  );
  isFormSubmitted = signal(false);
  isMobile = toSignal(this.#isMobile$);

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      // TODO: Implement password reset logic
      this.isFormSubmitted.set(true);
    }
  }
}
