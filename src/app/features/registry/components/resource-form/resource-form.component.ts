import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Textarea } from 'primeng/textarea';

import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormSelectComponent, TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';
import { SelectOption } from '@osf/shared/models';

import { resourceTypeOptions } from '../../constants';
import { RegistryResourceFormModel } from '../../models';

@Component({
  selector: 'osf-resource-form',
  imports: [TextInputComponent, TranslatePipe, ReactiveFormsModule, Textarea, FormSelectComponent, Button],
  templateUrl: './resource-form.component.html',
  styleUrl: './resource-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceFormComponent {
  formGroup = input.required<FormGroup<RegistryResourceFormModel>>();
  showCancelButton = input(true);
  showPreviewButton = input(false);
  cancelButtonLabel = input('common.buttons.cancel');
  primaryButtonLabel = input('common.buttons.save');

  cancelClicked = output<void>();
  submitClicked = output<void>();

  inputLimits = InputLimits;
  resourceOptions = signal<SelectOption[]>(resourceTypeOptions);

  getControl(controlName: keyof RegistryResourceFormModel): FormControl<string | null> {
    return this.formGroup().get(controlName) as FormControl<string | null>;
  }

  handleCancel(): void {
    this.cancelClicked.emit();
  }

  handleSubmit(): void {
    this.submitClicked.emit();
  }
}
