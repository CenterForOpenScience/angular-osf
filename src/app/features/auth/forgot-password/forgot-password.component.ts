import { Component, inject, signal } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { MessageInfo } from './message-info.model';
import { Message } from 'primeng/message';
import { ForgotPasswordFormGroupType } from '@osf/features/auth/forgot-password/forgot-password-form-group.type';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'osf-forgot-password',
  standalone: true,
  imports: [InputText, ReactiveFormsModule, Button, Message],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  #fb = inject(FormBuilder);
  #isXSmall$ = inject(IS_XSMALL);
  forgotPasswordForm: ForgotPasswordFormGroupType = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  isXSmall = toSignal(this.#isXSmall$);
  message = signal<MessageInfo | null>(null);

  onSubmit(): void {
    // TODO: Implement password reset logic
    if (this.forgotPasswordForm.valid) {
      this.message.set({
        severity: 'success',
        content: 'Thanks. Check your email to reset your password.',
      });

      // this.message.set({
      //   severity: 'error',
      //   content: 'Email not found.',
      // });
    }
  }

  onCloseMessage(): void {
    this.message.set(null);
  }
}
