import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BooleanOrNullOrUndefined } from '@core/helpers/types.helper';

@Component({
  selector: 'osf-password-input-hint',
  imports: [],
  templateUrl: './password-input-hint.component.html',
  styleUrl: './password-input-hint.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputHintComponent {
  isError = input<BooleanOrNullOrUndefined>(false);
}
