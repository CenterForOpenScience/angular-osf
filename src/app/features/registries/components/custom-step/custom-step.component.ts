import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { Chip } from 'primeng/chip';
import { Inplace } from 'primeng/inplace';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { RadioButton } from 'primeng/radiobutton';
import { Textarea } from 'primeng/textarea';

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InfoIconComponent } from '@osf/shared/components';
import { FILE_COUNT_ATTACHMENTS_LIMIT, INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants';
import { FieldType } from '@osf/shared/enums';
import { CustomValidators, findChangedFields } from '@osf/shared/helpers';
import { FileModel, FilePayloadJsonApi, PageSchema } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';

import { FilesMapper } from '../../mappers/files.mapper';
import { RegistriesSelectors, SetUpdatedFields, UpdateStepState } from '../../store';
import { FilesControlComponent } from '../files-control/files-control.component';

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
    FilesControlComponent,
    Chip,
  ],
  templateUrl: './custom-step.component.html',
  styleUrl: './custom-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomStepComponent implements OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stepsData = input.required<Record<string, any>>();
  filesLink = input.required<string>();
  projectId = input.required<string>();
  provider = input.required<string>();
  filesViewOnly = input<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateAction = output<Record<string, any>>();
  back = output<void>();
  next = output<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  readonly pages = select(RegistriesSelectors.getPagesSchema);
  readonly FieldType = FieldType;
  readonly stepsState = select(RegistriesSelectors.getStepsState);

  readonly actions = createDispatchMap({
    updateStepState: UpdateStepState,
    setUpdatedFields: SetUpdatedFields,
  });

  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  step = signal(this.route.snapshot.params['step']);
  currentPage = computed(() => this.pages()[this.step() - 1]);

  radio = null;

  stepForm!: FormGroup;

  attachedFiles: Record<string, Partial<FileModel & { file_id: string }>[]> = {};

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
    let questions = page.questions || [];
    if (page.sections?.length) {
      questions = [...questions, ...page.sections.flatMap((section) => section.questions ?? [])];
    }
    questions?.forEach((q) => {
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

        case FieldType.File:
          control = this.fb.control(this.stepsData()[controlName] || [], {
            validators: q.required ? [Validators.required] : [],
          });
          this.attachedFiles[controlName] =
            this.stepsData()[controlName]?.map((file: FilePayloadJsonApi) => ({ ...file, name: file.file_name })) || [];
          break;

        default:
          return;
      }

      this.stepForm.addControl(controlName, control);
    });
    if (this.stepsState()?.[this.step()]?.invalid) {
      this.stepForm.markAllAsTouched();
    }
  }

  private updateDraft() {
    const changedFields = findChangedFields(this.stepForm.value, this.stepsData());
    if (Object.keys(changedFields).length > 0) {
      this.actions.setUpdatedFields(changedFields);
      this.updateAction.emit(this.stepForm.value);
    }
  }

  private updateStepState() {
    if (this.stepForm) {
      this.updateDraft();
      this.stepForm.markAllAsTouched();
      this.actions.updateStepState(this.step(), this.stepForm.invalid, true);
    }
  }

  onAttachFile(file: FileModel, questionKey: string): void {
    this.attachedFiles[questionKey] = this.attachedFiles[questionKey] || [];

    if (!this.attachedFiles[questionKey].some((f) => f.file_id === file.id)) {
      if (this.attachedFiles[questionKey].length >= FILE_COUNT_ATTACHMENTS_LIMIT) {
        this.toastService.showWarn('shared.files.limitText');
        return;
      }
      this.attachedFiles[questionKey].push(file);
      this.stepForm.patchValue({
        [questionKey]: [...(this.attachedFiles[questionKey] || []), file],
      });
      const otherFormValues = { ...this.stepForm.value };
      delete otherFormValues[questionKey];
      this.updateAction.emit({
        [questionKey]: [
          ...this.attachedFiles[questionKey].map((f) => {
            if (f.file_id) {
              const { name: _, ...payload } = f;
              return payload;
            }
            return FilesMapper.toFilePayload(f as FileModel);
          }),
        ],
        ...otherFormValues,
      });
    }
  }

  removeFromAttachedFiles(file: Partial<FileModel & { file_id: string }>, questionKey: string): void {
    if (this.attachedFiles[questionKey]) {
      this.attachedFiles[questionKey] = this.attachedFiles[questionKey].filter((f) => f.file_id !== file.file_id);
      this.stepForm.patchValue({
        [questionKey]: this.attachedFiles[questionKey],
      });
      this.updateAction.emit({
        [questionKey]: [
          ...this.attachedFiles[questionKey].map((f) => {
            if (f.file_id) {
              const { name: _, ...payload } = f;
              return payload;
            }
            return FilesMapper.toFilePayload(f as FileModel);
          }),
        ],
      });
    }
  }

  goBack(): void {
    const previousStep = this.step() - 1;
    if (previousStep > 0) {
      this.router.navigate(['../', previousStep], { relativeTo: this.route });
    } else {
      this.back.emit();
    }
  }

  goNext(): void {
    const nextStep = this.step() + 1;
    if (nextStep <= this.pages().length) {
      this.router.navigate(['../', nextStep], { relativeTo: this.route });
    } else {
      this.next.emit();
    }
  }

  ngOnDestroy(): void {
    this.updateStepState();
  }
}
