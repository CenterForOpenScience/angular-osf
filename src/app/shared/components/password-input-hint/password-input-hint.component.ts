import { TranslatePipe } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'osf-password-input-hint',
  imports: [TranslatePipe, CommonModule],
  templateUrl: './password-input-hint.component.html',
  styleUrl: './password-input-hint.component.scss',
})
export class PasswordInputHintComponent {
  control = input<AbstractControl | null>(null);

  get validationError(): string | null {
    const ctrl = this.control();
    if (!ctrl || !ctrl.errors || !ctrl.touched) return null;

    if (ctrl.errors['required']) return 'required';
    if (ctrl.errors['minlength']) return 'minlength';
    if (ctrl.errors['pattern']) return 'pattern';

    return null;
  }
}
