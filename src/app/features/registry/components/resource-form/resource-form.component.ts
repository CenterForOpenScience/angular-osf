import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Textarea } from 'primeng/textarea';

import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { resourceTypeOptions } from '@osf/features/registry/constants';
import { FormSelectComponent, TextInputComponent } from '@shared/components';
import { InputLimits } from '@shared/constants';
import { SelectOption } from '@shared/models';

interface ResourceForm {
  pid: FormControl<string | null>;
  resourceType: FormControl<string | null>;
  description: FormControl<string | null>;
}

@Component({
  selector: 'osf-resource-form',
  imports: [TextInputComponent, TranslatePipe, ReactiveFormsModule, Textarea, FormSelectComponent, Button],
  templateUrl: './resource-form.component.html',
  styleUrl: './resource-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceFormComponent {
  formGroup = input.required<FormGroup<ResourceForm>>();
  showCancelButton = input(true);
  showPreviewButton = input(false);
  cancelButtonLabel = input('common.buttons.cancel');
  primaryButtonLabel = input('common.buttons.save');

  cancelClicked = output<void>();
  submitClicked = output<void>();

  protected inputLimits = InputLimits;
  public resourceOptions = signal<SelectOption[]>(resourceTypeOptions);

  protected getControl(controlName: keyof ResourceForm): FormControl<string | null> {
    return this.formGroup().get(controlName) as FormControl<string | null>;
  }

  handleCancel(): void {
    this.cancelClicked.emit();
  }

  handleSubmit(): void {
    this.submitClicked.emit();
  }
}
