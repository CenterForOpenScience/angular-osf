import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { BooleanOrNullOrUndefined } from '@osf/shared/helpers';

@Component({
  selector: 'osf-password-input-hint',
  imports: [TranslatePipe],
  templateUrl: './password-input-hint.component.html',
  styleUrl: './password-input-hint.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputHintComponent {
  isError = input<BooleanOrNullOrUndefined>(false);
}
