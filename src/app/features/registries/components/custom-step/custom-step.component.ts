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
  DestroyRef,
  effect,
  inject,
  input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InfoIconComponent } from '@osf/shared/components/info-icon/info-icon.component';
import { FILE_COUNT_ATTACHMENTS_LIMIT } from '@osf/shared/constants/files-limits.const';
import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { FieldType } from '@osf/shared/enums/field-type.enum';
import { CustomValidators } from '@osf/shared/helpers/custom-form-validators.helper';
import { findChangedFields } from '@osf/shared/helpers/find-changed-fields';
import { ToastService } from '@osf/shared/services/toast.service';
import { FileModel } from '@shared/models/files/file.model';
import { FilePayloadJsonApi } from '@shared/models/files/file-payload-json-api.model';
import { PageSchema } from '@shared/models/registration/page-schema.model';

import { FilesMapper } from '../../mappers/files.mapper';
import { AttachedFile } from '../../models/attached-file.model';
import { RegistriesSelectors, SetUpdatedFields, UpdateStepState } from '../../store';
import { FilesControlComponent } from '../files-control/files-control.component';

@Component({
  selector: 'osf-custom-step',
  imports: [
    Button,
    Card,
    Checkbox,
    Chip,
    Inplace,
    InputText,
    Message,
    RadioButton,
    Textarea,
    ReactiveFormsModule,
    NgTemplateOutlet,
    InfoIconComponent,
    FilesControlComponent,
    TranslatePipe,
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  readonly pages = select(RegistriesSelectors.getPagesSchema);
  readonly stepsState = select(RegistriesSelectors.getStepsState);

  private readonly actions = createDispatchMap({
    updateStepState: UpdateStepState,
    setUpdatedFields: SetUpdatedFields,
  });

  readonly FieldType = FieldType;
  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;

  step = signal(this.route.snapshot.params['step']);
  currentPage = computed(() => this.pages()[this.step() - 1]);

  stepForm: FormGroup = this.fb.group({});
  attachedFiles: Record<string, AttachedFile[]> = {};

  constructor() {
    this.setupRouteWatcher();
    this.setupPageFormInit();
  }

  ngOnDestroy(): void {
    this.saveStepState();
  }

  onAttachFile(file: FileModel, questionKey: string): void {
    this.attachedFiles[questionKey] = this.attachedFiles[questionKey] || [];

    if (this.attachedFiles[questionKey].some((f) => f.file_id === file.id)) {
      return;
    }

    if (this.attachedFiles[questionKey].length >= FILE_COUNT_ATTACHMENTS_LIMIT) {
      this.toastService.showWarn('shared.files.limitText');
      return;
    }

    this.attachedFiles[questionKey] = [...this.attachedFiles[questionKey], file];
    this.stepForm.patchValue({ [questionKey]: this.attachedFiles[questionKey] });

    const otherFormValues = { ...this.stepForm.value };
    delete otherFormValues[questionKey];
    this.updateAction.emit({
      [questionKey]: this.mapFilesToPayload(this.attachedFiles[questionKey]),
      ...otherFormValues,
    });
  }

  removeFromAttachedFiles(file: AttachedFile, questionKey: string): void {
    if (!this.attachedFiles[questionKey]) {
      return;
    }

    this.attachedFiles[questionKey] = this.attachedFiles[questionKey].filter((f) => f.file_id !== file.file_id);
    this.stepForm.patchValue({ [questionKey]: this.attachedFiles[questionKey] });
    this.updateAction.emit({
      [questionKey]: this.mapFilesToPayload(this.attachedFiles[questionKey]),
    });
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

  private setupRouteWatcher() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.saveStepState();
      this.step.set(+params['step']);
    });
  }

  private setupPageFormInit() {
    effect(() => {
      const page = this.currentPage();
      if (page) {
        this.initStepForm(page);
      }
    });
  }

  private initStepForm(page: PageSchema): void {
    this.stepForm = this.fb.group({});
    const questions = [
      ...(page.questions || []),
      ...(page.sections?.flatMap((section) => section.questions ?? []) ?? []),
    ];

    questions.forEach((q) => {
      const controlName = q.responseKey as string;
      const control = this.createControl(q.fieldType!, controlName, q.required);
      if (!control) return;

      if (q.fieldType === FieldType.File) {
        this.attachedFiles[controlName] =
          this.stepsData()[controlName]?.map((file: FilePayloadJsonApi) => ({ ...file, name: file.file_name })) || [];
      }

      this.stepForm.addControl(controlName, control);
    });

    if (this.stepsState()?.[this.step()]?.invalid) {
      this.stepForm.markAllAsTouched();
    }
  }

  private createControl(fieldType: FieldType, controlName: string, required: boolean): FormControl | null {
    const value = this.stepsData()[controlName];

    switch (fieldType) {
      case FieldType.Text:
      case FieldType.TextArea:
        return this.fb.control(value, {
          validators: required ? [CustomValidators.requiredTrimmed()] : [],
        });

      case FieldType.Checkbox:
      case FieldType.File:
        return this.fb.control(value || [], {
          validators: required ? [Validators.required] : [],
        });

      case FieldType.Radio:
      case FieldType.Select:
        return this.fb.control(value, {
          validators: required ? [Validators.required] : [],
        });

      default:
        return null;
    }
  }

  private saveStepState() {
    if (!this.stepForm.controls || !Object.keys(this.stepForm.controls).length) {
      return;
    }

    const changedFields = findChangedFields(this.stepForm.value, this.stepsData());
    if (Object.keys(changedFields).length > 0) {
      this.actions.setUpdatedFields(changedFields);
      this.updateAction.emit(this.stepForm.value);
    }

    this.stepForm.markAllAsTouched();
    this.actions.updateStepState(this.step(), this.stepForm.invalid, true);
  }

  private mapFilesToPayload(files: AttachedFile[]): FilePayloadJsonApi[] {
    return files.map((f) => {
      if (f.file_id) {
        const { name: _, ...payload } = f;
        return payload as FilePayloadJsonApi;
      }
      return FilesMapper.toFilePayload(f as FileModel);
    });
  }
}
