import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Message } from 'primeng/message';

import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { CustomValidators } from '@osf/shared/utils';

import { ForgotPasswordFormGroupType, MessageInfo } from '../../models';

@Component({
  selector: 'osf-forgot-password',
  imports: [ReactiveFormsModule, Button, Message, TextInputComponent, TranslatePipe],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);

  readonly emailLimit = InputLimits.email.maxLength;

  forgotPasswordForm: ForgotPasswordFormGroupType = this.fb.group({
    email: ['', [CustomValidators.requiredTrimmed(), Validators.email]],
  });

  message = signal<MessageInfo | null>(null);

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.forgotPasswordForm.reset();

    this.message.set({
      severity: 'success',
      content: 'auth.forgotPassword.messages.success',
    });
  }

  onCloseMessage(): void {
    this.message.set(null);
  }
}
