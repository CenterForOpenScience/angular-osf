import { TranslatePipe } from '@ngx-translate/core';

import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { SelectOption } from '@osf/shared/models/select-option.model';

@Component({
  selector: 'osf-form-select',
  imports: [ReactiveFormsModule, Select, TranslatePipe],
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSelectComponent {
  control = input.required<FormControl>();
  options = input.required<SelectOption[]>();
  label = input<string>('');
  placeholder = input<string>('');
  appendTo = input<string | null>(null);
  fullWidth = input(false);

  selectId = `select-${Math.random().toString(36).substring(2, 15)}`;
}
