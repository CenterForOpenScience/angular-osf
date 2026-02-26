import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Textarea } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { formInputLimits } from '@osf/features/preprints/constants';
import { TitleAndAbstractForm } from '@osf/features/preprints/models';
import {
  CreatePreprint,
  PreprintStepperSelectors,
  UpdatePreprint,
} from '@osf/features/preprints/store/preprint-stepper';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { CustomValidators } from '@osf/shared/helpers/custom-form-validators.helper';
import { ToastService } from '@osf/shared/services/toast.service';

@Component({
  selector: 'osf-title-and-abstract-step',
  imports: [
    Button,
    Card,
    Textarea,
    RouterLink,
    Tooltip,
    Message,
    FormsModule,
    ReactiveFormsModule,
    TextInputComponent,
    TranslatePipe,
  ],
  templateUrl: './title-and-abstract-step.component.html',
  styleUrl: './title-and-abstract-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleAndAbstractStepComponent {
  private readonly toastService = inject(ToastService);

  readonly providerId = input.required<string>();
  readonly nextClicked = output<void>();

  private readonly actions = createDispatchMap({
    createPreprint: CreatePreprint,
    updatePreprint: UpdatePreprint,
  });

  readonly createdPreprint = select(PreprintStepperSelectors.getPreprint);
  readonly isUpdatingPreprint = select(PreprintStepperSelectors.isPreprintSubmitting);

  readonly inputLimits = formInputLimits;
  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  titleAndAbstractForm = new FormGroup<TitleAndAbstractForm>({
    title: new FormControl('', {
      nonNullable: true,
      validators: [CustomValidators.requiredTrimmed(), Validators.maxLength(this.inputLimits.title.maxLength)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [
        CustomValidators.requiredTrimmed(),
        Validators.minLength(this.inputLimits.abstract.minLength),
        Validators.maxLength(this.inputLimits.abstract.maxLength),
      ],
    }),
  });

  constructor() {
    effect(() => {
      const createdPreprint = this.createdPreprint();
      if (!createdPreprint) return;

      this.titleAndAbstractForm.patchValue({
        title: createdPreprint.title,
        description: createdPreprint.description,
      });
    });
  }

  nextButtonClicked(): void {
    if (this.titleAndAbstractForm.invalid) {
      return;
    }

    const model = this.titleAndAbstractForm.getRawValue();
    const createdPreprint = this.createdPreprint();

    if (createdPreprint) {
      this.actions.updatePreprint(createdPreprint.id, model).subscribe({
        complete: () => {
          this.nextClicked.emit();
          this.toastService.showSuccess('preprints.preprintStepper.common.successMessages.preprintSaved');
        },
      });
    } else {
      this.actions.createPreprint(model.title, model.description, this.providerId()).subscribe({
        complete: () => {
          this.nextClicked.emit();
          this.toastService.showSuccess('preprints.preprintStepper.common.successMessages.preprintSaved');
        },
      });
    }
  }
}
