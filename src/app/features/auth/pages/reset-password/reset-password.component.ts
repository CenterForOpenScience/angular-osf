import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Password } from 'primeng/password';

import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PasswordInputHintComponent } from '@shared/components';
import { IS_XSMALL } from '@shared/utils';

import { PASSWORD_REGEX, passwordMatchValidator } from '../../helpers';
import { ResetPasswordFormGroupType } from '../../models';

@Component({
  selector: 'osf-reset-password',
  imports: [Button, Password, ReactiveFormsModule, RouterLink, PasswordInputHintComponent, TranslatePipe],
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
