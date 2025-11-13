import { TranslatePipe } from '@ngx-translate/core';

import { InputText } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { ValidationParams } from '@shared/models/validation-params.model';

@Component({
  selector: 'osf-text-input',
  imports: [TranslatePipe, InputText, MessageModule, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputComponent {
  control = input.required<FormControl>();
  label = input<string>('');
  placeholder = input<string>('');
  helpText = input<string>('');
  type = input<string>('text');
  minLength = input<number>();
  maxLength = input<number>();

  inputId = input<string>(`input-${Math.random().toString(36).substring(2, 15)}`);
  helpId = `help-${Math.random().toString(36).substring(2, 15)}`;

  getErrorMessage(): ValidationParams {
    const errors = this.control()?.errors;

    if (!errors) {
      return { key: '' };
    }

    if (errors['required']) {
      return { key: INPUT_VALIDATION_MESSAGES.required };
    }

    if (errors['email']) {
      return { key: INPUT_VALIDATION_MESSAGES.email };
    }

    if (errors['link']) {
      return { key: INPUT_VALIDATION_MESSAGES.link };
    }

    if (errors['maxlength'])
      return {
        key: INPUT_VALIDATION_MESSAGES.maxLength,
        params: { length: errors['maxlength'].requiredLength },
      };

    if (errors['minlength'])
      return {
        key: INPUT_VALIDATION_MESSAGES.minLength,
        params: { length: errors['minlength'].requiredLength },
      };

    return { key: INPUT_VALIDATION_MESSAGES.invalidInput };
  }
}
