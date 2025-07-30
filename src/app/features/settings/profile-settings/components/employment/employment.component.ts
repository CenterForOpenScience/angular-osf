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

import { UpdateProfileSettingsEmployment, UserSelectors } from '@osf/core/store/user';
import { Employment } from '@osf/shared/models';
import { CustomConfirmationService, LoaderService, ToastService } from '@osf/shared/services';
import { CustomValidators, findChangedFields } from '@osf/shared/utils';

import { EmploymentForm } from '../../models';
import { EmploymentFormComponent } from '../employment-form/employment-form.component';

@Component({
  selector: 'osf-employment',
  imports: [Button, ReactiveFormsModule, TranslatePipe, EmploymentFormComponent],
  templateUrl: './employment.component.html',
  styleUrl: './employment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentComponent {
  @HostBinding('class') classes = 'flex flex-column gap-5';

  private readonly loaderService = inject(LoaderService);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);

  readonly actions = createDispatchMap({ updateProfileSettingsEmployment: UpdateProfileSettingsEmployment });
  readonly employment = select(UserSelectors.getEmployment);

  readonly employmentForm = this.fb.group({ positions: this.fb.array<EmploymentForm>([]) });

  constructor() {
    effect(() => this.setInitialData());
  }

  get positions(): FormArray<FormGroup> {
    return this.employmentForm.get('positions') as FormArray<FormGroup>;
  }

  removePosition(index: number): void {
    this.positions.removeAt(index);
  }

  addPosition(): void {
    if (this.employmentForm.invalid) {
      this.employmentForm.markAllAsTouched();
      return;
    }

    this.positions.push(this.createEmploymentFormGroup());
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

  saveEmployment(): void {
    if (this.employmentForm.invalid) {
      this.employmentForm.markAllAsTouched();
      return;
    }

    const formattedEmployment = this.positions.value.map((position) => this.mapFormToEmployment(position));
    this.loaderService.show();

    this.actions
      .updateProfileSettingsEmployment({ employment: formattedEmployment })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loaderService.hide();
          this.toastService.showSuccess('settings.profileSettings.employment.successUpdate');
        },
        error: () => this.loaderService.hide(),
      });
  }

  private hasFormChanges(): boolean {
    if (this.positions.length !== this.employment().length) {
      return true;
    }

    return this.positions.value.some((formEmployment, index) => {
      const initial = this.employment()[index];
      if (!initial) return true;

      const formattedFormEducation = this.mapFormToEmployment(formEmployment);
      const changedFields = findChangedFields<Employment>(formattedFormEducation, initial);

      return Object.keys(changedFields).length > 0;
    });
  }

  private createEmploymentFormGroup(employment?: Partial<EmploymentForm>): FormGroup {
    return this.fb.group(
      {
        title: [employment?.title ?? '', CustomValidators.requiredTrimmed()],
        institution: [employment?.institution ?? ''],
        department: [employment?.department ?? ''],
        startDate: [employment?.startDate ?? null],
        endDate: [employment?.endDate ?? null],
        ongoing: [employment?.ongoing ?? false],
      },
      { validators: CustomValidators.dateRangeValidator }
    );
  }

  private setInitialData(): void {
    const employment = this.employment();
    if (!employment?.length) return;

    this.positions.clear();
    employment
      .map((x) => this.mapEmploymentToForm(x))
      .forEach((x) => this.positions.push(this.createEmploymentFormGroup(x)));
  }

  private mapFormToEmployment(employment: EmploymentForm): Employment {
    return {
      title: employment.title,
      department: employment.department,
      institution: employment.institution,
      startYear: employment.startDate?.getFullYear() ?? new Date().getFullYear(),
      startMonth: (employment.startDate?.getMonth() ?? 0) + 1,
      endYear: employment.ongoing ? null : (employment.endDate?.getFullYear() ?? null),
      endMonth: employment.ongoing ? null : employment.endDate ? employment.endDate.getMonth() + 1 : null,
      ongoing: employment.ongoing,
    };
  }

  private mapEmploymentToForm(employment: Employment): EmploymentForm {
    return {
      title: employment.title,
      department: employment.department,
      institution: employment.institution,
      startDate: new Date(+employment.startYear, employment.startMonth - 1),
      endDate: employment.ongoing
        ? null
        : employment.endYear && employment.endMonth
          ? new Date(+employment.endYear, employment.endMonth - 1)
          : null,
      ongoing: employment.ongoing,
    };
  }
}
