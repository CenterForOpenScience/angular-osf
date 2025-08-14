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
import { CustomValidators } from '@osf/shared/helpers';
import { CustomConfirmationService, LoaderService, ToastService } from '@osf/shared/services';

import { EducationForm } from '../../models';
import { hasEducationChanges, mapEducationToForm, mapFormToEducation } from '../../utils';
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

      return hasEducationChanges(formEducation, initialEdu);
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
      .map((education) => mapEducationToForm(education))
      .forEach((education) => this.educations.push(this.createEducationFormGroup(education)));

    this.cd.markForCheck();
  }
}
