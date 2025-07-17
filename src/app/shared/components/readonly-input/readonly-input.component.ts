import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'osf-readonly-input',
  imports: [IconField, InputIcon, InputText],
  templateUrl: './readonly-input.component.html',
  styleUrl: './readonly-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadonlyInputComponent {
  value = input.required<string>();
  readonly = input<boolean>(true);
  disabled = input<boolean>(false);
  placeholder = input<string>('');

  deleteItem = output<void>();
}
