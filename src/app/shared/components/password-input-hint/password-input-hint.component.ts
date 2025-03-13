import { Component, input } from '@angular/core';

@Component({
  selector: 'osf-password-input-hint',
  imports: [],
  templateUrl: './password-input-hint.component.html',
  styleUrl: './password-input-hint.component.scss',
})
export class PasswordInputHintComponent {
  isError = input<boolean | null | undefined>(false);
}
