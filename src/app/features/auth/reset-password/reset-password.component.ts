import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Password } from 'primeng/password';
import { RouterLink } from '@angular/router';
import {
  PASSWORD_REGEX,
  passwordMatchValidator,
} from '../sign-up/sign-up.helper';
import { PasswordInputHintComponent } from '@shared/components/password-input-hint/password-input-hint.component';
import { ResetPasswordFormGroupType } from './reset-password-form-group.type';

@Component({
  selector: 'osf-reset-password',
  standalone: true,
  imports: [
    Button,
    Password,
    ReactiveFormsModule,
    RouterLink,
    PasswordInputHintComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  #fb = inject(FormBuilder);
  passwordRegex = PASSWORD_REGEX;
  resetPasswordForm: ResetPasswordFormGroupType = this.#fb.group(
    {
      newPassword: [
        '',
        [Validators.required, Validators.pattern(this.passwordRegex)],
      ],
      confirmNewPassword: ['', Validators.required],
    },
    {
      validators: passwordMatchValidator(),
    },
  );
  isFormSubmitted = signal(false);

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      // TODO: Implement password reset logic
      this.isFormSubmitted.set(true);
    }
  }
}
