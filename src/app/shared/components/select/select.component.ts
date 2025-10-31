import { TranslatePipe } from '@ngx-translate/core';

import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Primitive } from '@osf/shared/helpers/types.helper';
import { SelectOption } from '@osf/shared/models/select-option.model';
import { FixSpecialCharPipe } from '@osf/shared/pipes/fix-special-char.pipe';

@Component({
  selector: 'osf-select',
  imports: [FormsModule, Select, TranslatePipe, FixSpecialCharPipe],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  options = input.required<SelectOption[]>();
  selectedValue = model.required<Primitive>();
  placeholder = input<string>('');
  appendTo = input<string | null>(null);
  fullWidth = input(false);
  noBorder = input(false);
  disabled = input(false);
  loading = input(false);

  changeValue = output<Primitive>();
}
