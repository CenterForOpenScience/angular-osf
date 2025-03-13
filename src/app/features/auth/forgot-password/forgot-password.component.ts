import { Component, inject, signal } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { MessageInfo } from './message-info.model';
import { Message } from 'primeng/message';

@Component({
  selector: 'osf-forgot-password',
  standalone: true,
  imports: [InputText, ReactiveFormsModule, Button, Message],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message = signal<null | MessageInfo>(null);
  private fb = inject(FormBuilder);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

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
