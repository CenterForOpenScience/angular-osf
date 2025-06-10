import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';

import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ForgotPasswordFormGroupType, MessageInfo } from '../../models';

@Component({
  selector: 'osf-forgot-password',
  imports: [InputText, ReactiveFormsModule, Button, Message, TranslatePipe],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  #fb = inject(FormBuilder);
  forgotPasswordForm: ForgotPasswordFormGroupType = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  message = signal<MessageInfo | null>(null);

  onSubmit(): void {
    // [NS] TODO: Implement password reset logic
    if (this.forgotPasswordForm.valid) {
      this.message.set({
        severity: 'success',
        content: 'auth.forgotPassword.messages.success',
      });

      // this.message.set({
      //   severity: 'error',
      //   content: 'auth.forgotPassword.messages.error'
      // });
    }
  }

  onCloseMessage(): void {
    this.message.set(null);
  }
}
