import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Textarea } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, effect, inject, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { formInputLimits } from '@osf/features/preprints/constants';
import { TitleAndAbstractForm } from '@osf/features/preprints/models';
import {
  CreatePreprint,
  PreprintStepperSelectors,
  UpdatePreprint,
} from '@osf/features/preprints/store/preprint-stepper';
import { TextInputComponent } from '@shared/components';
import { INPUT_VALIDATION_MESSAGES } from '@shared/constants';
import { ToastService } from '@shared/services';
import { CustomValidators } from '@shared/utils';

@Component({
  selector: 'osf-title-and-abstract-step',
  imports: [
    Card,
    FormsModule,
    Button,
    Textarea,
    RouterLink,
    ReactiveFormsModule,
    Tooltip,
    Message,
    TranslatePipe,
    TextInputComponent,
  ],
  templateUrl: './title-and-abstract-step.component.html',
  styleUrl: './title-and-abstract-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleAndAbstractStepComponent {
  private toastService = inject(ToastService);

  private actions = createDispatchMap({
    createPreprint: CreatePreprint,
    updatePreprint: UpdatePreprint,
  });

  protected inputLimits = formInputLimits;
  protected readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  protected titleAndAbstractForm = new FormGroup<TitleAndAbstractForm>({
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

  createdPreprint = select(PreprintStepperSelectors.getPreprint);
  providerId = select(PreprintStepperSelectors.getSelectedProviderId);

  isUpdatingPreprint = select(PreprintStepperSelectors.isPreprintSubmitting);
  nextClicked = output<void>();

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

  nextButtonClicked() {
    if (this.titleAndAbstractForm.invalid) {
      return;
    }

    const model = this.titleAndAbstractForm.value;

    if (this.createdPreprint()) {
      this.actions.updatePreprint(this.createdPreprint()!.id, model).subscribe({
        complete: () => {
          this.nextClicked.emit();
          this.toastService.showSuccess('preprints.preprintStepper.common.successMessages.preprintSaved');
        },
      });
    } else {
      this.actions.createPreprint(model.title!, model.description!, this.providerId()!).subscribe({
        complete: () => {
          this.nextClicked.emit();
          this.toastService.showSuccess('preprints.preprintStepper.common.successMessages.preprintSaved');
        },
      });
    }
  }
}
