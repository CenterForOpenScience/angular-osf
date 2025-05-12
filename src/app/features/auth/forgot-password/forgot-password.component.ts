import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';

import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ForgotPasswordFormGroupType } from '@osf/features/auth/forgot-password/forgot-password-form-group.type';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

import { MessageInfo } from './message-info.model';

@Component({
  selector: 'osf-forgot-password',
  standalone: true,
  imports: [InputText, ReactiveFormsModule, Button, Message, TranslatePipe],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  #fb = inject(FormBuilder);
  #isMobile$ = inject(IS_XSMALL);
  forgotPasswordForm: ForgotPasswordFormGroupType = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  isMobile = toSignal(this.#isMobile$);
  message = signal<MessageInfo | null>(null);

  onSubmit(): void {
    // TODO: Implement password reset logic
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
