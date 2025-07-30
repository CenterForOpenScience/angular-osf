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
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { UpdateProfileSettingsEducation, UserSelectors } from '@osf/core/store/user';
import { Education } from '@osf/shared/models';
import { CustomConfirmationService, LoaderService, ToastService } from '@osf/shared/services';
import { CustomValidators, findChangedFields } from '@osf/shared/utils';

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
    this.educations.removeAt(index);
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
      onConfirm: () => {
        this.setInitialData();
        this.cd.markForCheck();
      },
    });
  }

  saveEducation(): void {
    if (this.educationForm.invalid) {
      this.educationForm.markAllAsTouched();
      return;
    }

    const formattedEducation = this.educations.value.map((education) => this.mapFormToEducation(education));
    this.loaderService.show();

    this.actions
      .updateProfileSettingsEducation({ education: formattedEducation })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loaderService.hide();
          this.toastService.showSuccess('settings.profileSettings.education.successUpdate');
        },
        error: () => this.loaderService.hide(),
      });
  }

  private hasFormChanges(): boolean {
    if (this.educations.length !== this.educationItems().length) {
      return true;
    }

    return this.educations.value.some((formEducation, index) => {
      const initialEdu = this.educationItems()[index];
      if (!initialEdu) return true;

      const formattedFormEducation = this.mapFormToEducation(formEducation);
      const changedFields = findChangedFields<Education>(formattedFormEducation, initialEdu);

      return Object.keys(changedFields).length > 0;
    });
  }

  private createEducationFormGroup(education?: Partial<EducationForm>): FormGroup {
    return this.fb.group(
      {
        institution: [education?.institution ?? '', CustomValidators.requiredTrimmed()],
        department: [education?.department ?? ''],
        degree: [education?.degree ?? ''],
        startDate: [education?.startDate ?? null],
        endDate: [education?.endDate ?? null],
        ongoing: [education?.ongoing ?? false],
      },
      { validators: CustomValidators.dateRangeValidator }
    );
  }

  private setInitialData(): void {
    const educations = this.educationItems();
    if (!educations?.length) return;

    this.educations.clear();
    educations
      .map((education) => this.mapEducationToForm(education))
      .forEach((education) => this.educations.push(this.createEducationFormGroup(education)));

    this.cd.markForCheck();
  }

  private mapFormToEducation(education: EducationForm): Education {
    return {
      institution: education.institution,
      department: education.department,
      degree: education.degree,
      startYear: education.startDate?.getFullYear() ?? new Date().getFullYear(),
      startMonth: (education.startDate?.getMonth() ?? 0) + 1,
      endYear: education.ongoing ? null : (education.endDate?.getFullYear() ?? null),
      endMonth: education.ongoing ? null : education.endDate ? education.endDate.getMonth() + 1 : null,
      ongoing: education.ongoing,
    };
  }

  private mapEducationToForm(education: Education): EducationForm {
    return {
      institution: education.institution,
      department: education.department,
      degree: education.degree,
      startDate: new Date(+education.startYear, education.startMonth - 1),
      endDate: education.ongoing
        ? null
        : education.endYear && education.endMonth
          ? new Date(+education.endYear, education.endMonth - 1)
          : null,
      ongoing: education.ongoing,
    };
  }
}
