import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { Inplace } from 'primeng/inplace';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { RadioButton } from 'primeng/radiobutton';
import { Textarea } from 'primeng/textarea';

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InfoIconComponent } from '@osf/shared/components';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants';
import { CustomValidators, findChangedFields } from '@osf/shared/utils';

import { FieldType } from '../../enums';
import { PageSchema } from '../../models';
import { RegistriesSelectors, UpdateDraft, UpdateStepValidation } from '../../store';

@Component({
  selector: 'osf-custom-step',
  imports: [
    Card,
    Textarea,
    RadioButton,
    FormsModule,
    Checkbox,
    TranslatePipe,
    InputText,
    NgTemplateOutlet,
    Inplace,
    TranslatePipe,
    InfoIconComponent,
    Button,
    ReactiveFormsModule,
    Message,
  ],
  templateUrl: './custom-step.component.html',
  styleUrl: './custom-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomStepComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly pages = select(RegistriesSelectors.getPagesSchema);
  protected readonly FieldType = FieldType;
  protected readonly stepsData = select(RegistriesSelectors.getStepsData);
  protected stepsValidation = select(RegistriesSelectors.getStepsValidation);

  protected actions = createDispatchMap({
    updateDraft: UpdateDraft,
    updateStepValidation: UpdateStepValidation,
  });

  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  step = signal(this.route.snapshot.params['step']);
  currentPage = computed(() => this.pages()[this.step() - 1]);

  radio = null;

  stepForm!: FormGroup;

  constructor() {
    this.route.params.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.updateStepState();
      this.step.set(+params['step']);
    });

    effect(() => {
      const page = this.currentPage();
      if (page) {
        this.initStepForm(page);
      }
    });
  }

  private initStepForm(page: PageSchema): void {
    this.stepForm = this.fb.group({});

    page.questions?.forEach((q) => {
      const controlName = q.responseKey as string;
      let control: FormControl;

      switch (q.fieldType) {
        case FieldType.Text:
        case FieldType.TextArea:
          control = this.fb.control(this.stepsData()[controlName], {
            validators: q.required ? [CustomValidators.requiredTrimmed()] : [],
          });
          break;

        case FieldType.Checkbox:
          control = this.fb.control(this.stepsData()[controlName] || [], {
            validators: q.required ? [Validators.required] : [],
          });
          break;

        case FieldType.Radio:
        case FieldType.Select:
          control = this.fb.control(this.stepsData()[controlName], {
            validators: q.required ? [Validators.required] : [],
          });
          break;

        default:
          console.warn(`Unsupported field type: ${q.fieldType}`);
          return;
      }

      this.stepForm.addControl(controlName, control);
    });
    if (this.stepsValidation()?.[this.step()]?.invalid) {
      this.stepForm.markAllAsTouched();
    }
  }

  private updateDraft() {
    const changedFields = findChangedFields(this.stepForm.value, this.stepsData());
    if (Object.keys(changedFields).length > 0) {
      const draftId = this.route.snapshot.params['id'];
      const attributes = {
        registration_responses: this.stepForm.value,
      };
      this.actions.updateDraft(draftId, attributes);
    }
  }

  private updateStepState() {
    if (this.stepForm) {
      this.updateDraft();
      this.stepForm.markAllAsTouched();
      this.actions.updateStepValidation(this.step(), this.stepForm.invalid);
    }
  }

  goBack(): void {
    const previousStep = this.step() - 1;
    if (previousStep > 0) {
      this.router.navigate(['../', previousStep], { relativeTo: this.route });
    } else {
      this.router.navigate(['../', 'metadata'], { relativeTo: this.route });
    }
  }

  goNext(): void {
    const nextStep = this.step() + 1;
    if (nextStep <= this.pages().length) {
      this.router.navigate(['../', nextStep], { relativeTo: this.route });
    } else {
      this.router.navigate(['../', 'review'], { relativeTo: this.route });
    }
  }

  ngOnDestroy(): void {
    this.updateStepState();
  }
}
