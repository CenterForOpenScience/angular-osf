import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Message } from 'primeng/message';

import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '@core/services/auth.service';
import { MessageInfo } from '@osf/features/auth/models';
import { ResendConfirmationFormGroupType } from '@osf/features/auth/models/resend-confirmation.model';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { InputLimits } from '@osf/shared/constants/input-limits.const';
import { CustomValidators } from '@osf/shared/helpers/custom-form-validators.helper';

@Component({
  selector: 'osf-resend-confirmation',
  imports: [ReactiveFormsModule, Button, Message, TextInputComponent, TranslatePipe],
  templateUrl: './resend-confirmation.component.html',
  styleUrl: './resend-confirmation.component.scss',
})
export class ResendConfirmationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly emailLimit = InputLimits.email.maxLength;

  resendConfirmationForm: ResendConfirmationFormGroupType = this.fb.group({
    email: ['', [CustomValidators.requiredTrimmed(), Validators.email]],
  });

  message = signal<MessageInfo | null>(null);

  onSubmit(): void {
    if (this.resendConfirmationForm.invalid) {
      return;
    }

    const emailForm = this.resendConfirmationForm.getRawValue();

    this.authService.resendConfirmationUrl(emailForm.email).subscribe(() => {
      this.resendConfirmationForm.reset();

      this.message.set({
        severity: 'success',
        content: 'auth.resendConfirmation.messages.success',
      });
    });
  }

  onCloseMessage(): void {
    this.message.set(null);
  }
}
