import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  HostBinding,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { UpdateProfileSettingsEducation, UserSelectors } from '@osf/core/store/user';
import { CustomValidators } from '@osf/shared/helpers';
import { CustomConfirmationService, LoaderService, ToastService } from '@osf/shared/services';

import { hasEducationChanges, mapEducationToForm, mapFormToEducation } from '../../helpers';
import { EducationForm } from '../../models';
import { EducationFormComponent } from '../education-form/education-form.component';

@Component({
  selector: 'osf-education',
  imports: [ReactiveFormsModule, Button, TranslatePipe, EducationFormComponent],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationComponent {
  @HostBinding('class') classes = 'flex flex-column gap-5';

  private readonly loaderService = inject(LoaderService);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);

  readonly educationForm = this.fb.group({ educations: this.fb.array<FormGroup>([]) });
  readonly actions = createDispatchMap({ updateProfileSettingsEducation: UpdateProfileSettingsEducation });
  readonly educationItems = select(UserSelectors.getEducation);

  constructor() {
    effect(() => this.setInitialData());
  }

  get educations(): FormArray<FormGroup> {
    return this.educationForm.get('educations') as FormArray<FormGroup>;
  }

  removeEducation(index: number): void {
    if (this.educations.length > 1) {
      this.educations.removeAt(index);
    } else {
      this.educations.reset();
    }
  }

  addEducation(): void {
    if (this.educationForm.invalid) {
      this.educationForm.markAllAsTouched();
      return;
    }

    this.educations.push(this.createEducationFormGroup());
  }

  discardChanges(): void {
    if (!this.hasFormChanges()) {
      return;
    }

    this.customConfirmationService.confirmDelete({
      headerKey: 'common.discardChangesDialog.header',
      messageKey: 'common.discardChangesDialog.message',
      acceptLabelKey: 'common.buttons.discardChanges',
      onConfirm: () => {
        this.setInitialData();
        this.toastService.showSuccess('settings.profileSettings.changesDiscarded');
      },
    });
  }

  saveEducation(): void {
    if (this.educationForm.invalid) {
      this.educationForm.markAllAsTouched();
      return;
    }

    const formattedEducation = this.educations.value.map((education) => mapFormToEducation(education));
    this.loaderService.show();

    this.actions
      .updateProfileSettingsEducation(formattedEducation)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loaderService.hide();
          this.toastService.showSuccess('settings.profileSettings.education.successUpdate');
        },
        error: () => this.loaderService.hide(),
      });
  }

  hasFormChanges(): boolean {
    const education = this.educationItems();
    const formPositions = this.educations.value;

    if (!education?.length) {
      return formPositions.some(
        (position) =>
          position.degree?.trim() ||
          position.institution?.trim() ||
          position.department?.trim() ||
          position.startDate ||
          position.endDate ||
          position.ongoing
      );
    }

    return this.educations.value.some((formEducation, index) => {
      const initialEdu = this.educationItems()[index];
      if (!initialEdu) return true;

      return hasEducationChanges(formEducation, initialEdu);
    });
  }

  private createEducationFormGroup(education?: Partial<EducationForm>): FormGroup {
    const isOngoing = education?.ongoing ?? false;
    const endDateValidators = isOngoing ? [] : [Validators.required];

    return this.fb.group(
      {
        institution: [education?.institution ?? '', CustomValidators.requiredTrimmed()],
        department: [education?.department ?? ''],
        degree: [education?.degree ?? ''],
        startDate: [education?.startDate ?? null, Validators.required],
        endDate: [education?.endDate ?? null, endDateValidators],
        ongoing: [isOngoing],
      },
      { validators: CustomValidators.monthYearRangeValidator }
    );
  }

  private setInitialData(): void {
    const educations = this.educationItems();

    this.educations.clear();

    if (!educations?.length) {
      this.addEducation();
      this.cd.markForCheck();
      return;
    }

    educations
      .map((education) => mapEducationToForm(education))
      .forEach((education) => this.educations.push(this.createEducationFormGroup(education)));

    this.cd.markForCheck();
  }
}
