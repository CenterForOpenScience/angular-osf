import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { InputLimits } from '@osf/shared/constants/input-limits.const';

import { NameForm } from '../../models';

@Component({
  selector: 'osf-name-form',
  imports: [ReactiveFormsModule, TranslatePipe, TextInputComponent],
  templateUrl: './name-form.component.html',
  styleUrl: './name-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameFormComponent {
  form = input.required<FormGroup<NameForm>>();

  readonly inputLimits = InputLimits;
}
