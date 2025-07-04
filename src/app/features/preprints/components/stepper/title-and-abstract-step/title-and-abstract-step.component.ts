import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Textarea } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, HostListener, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { formInputLimits } from '@osf/features/preprints/constants';
import { TitleAndAbstractForm } from '@osf/features/preprints/models';
import { CreatePreprint, SubmitPreprintSelectors, UpdatePreprint } from '@osf/features/preprints/store/submit-preprint';
import { TextInputComponent } from '@shared/components';
import { INPUT_VALIDATION_MESSAGES } from '@shared/constants';
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
export class TitleAndAbstractStepComponent implements OnInit {
  protected titleAndAbstractForm!: FormGroup<TitleAndAbstractForm>;
  protected inputLimits = formInputLimits;
  protected readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  private actions = createDispatchMap({
    createPreprint: CreatePreprint,
    updatePreprint: UpdatePreprint,
  });

  createdPreprint = select(SubmitPreprintSelectors.getCreatedPreprint);
  providerId = select(SubmitPreprintSelectors.getSelectedProviderId);

  isUpdatingPreprint = select(SubmitPreprintSelectors.isPreprintSubmitting);
  nextClicked = output<void>();

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.titleAndAbstractForm = new FormGroup<TitleAndAbstractForm>({
      title: new FormControl(this.createdPreprint()?.title || '', {
        nonNullable: true,
        validators: [CustomValidators.requiredTrimmed(), Validators.maxLength(this.inputLimits.title.maxLength)],
      }),
      description: new FormControl(this.createdPreprint()?.description || '', {
        nonNullable: true,
        validators: [
          CustomValidators.requiredTrimmed(),
          Validators.minLength(this.inputLimits.abstract.minLength),
          Validators.maxLength(this.inputLimits.abstract.maxLength),
        ],
      }),
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
        },
      });
    } else {
      this.actions.createPreprint(model.title!, model.description!, this.providerId()!).subscribe({
        complete: () => {
          this.nextClicked.emit();
        },
      });
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload($event: BeforeUnloadEvent): boolean {
    if (this.createdPreprint() || this.titleAndAbstractForm.value) {
      $event.preventDefault();
      return false;
    }
    return true;
  }
}
