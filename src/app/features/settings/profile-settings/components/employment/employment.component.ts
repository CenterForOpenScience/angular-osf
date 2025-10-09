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

import { UpdateProfileSettingsEmployment, UserSelectors } from '@osf/core/store/user';
import { CustomValidators } from '@osf/shared/helpers';
import { CustomConfirmationService, LoaderService, ToastService } from '@osf/shared/services';

import { hasEmploymentChanges, mapEmploymentToForm, mapFormToEmployment } from '../../helpers';
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
      acceptLabelKey: 'common.buttons.discardChanges',
      onConfirm: () => {
        this.setInitialData();
        this.toastService.showSuccess('settings.profileSettings.changesDiscarded');
      },
    });
  }

  saveEmployment(): void {
    if (this.employmentForm.invalid) {
      this.employmentForm.markAllAsTouched();
      return;
    }

    const employments = this.positions.value.map(mapFormToEmployment);
    this.loaderService.show();

    this.actions
      .updateProfileSettingsEmployment(employments)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loaderService.hide();
          this.toastService.showSuccess('settings.profileSettings.employment.successUpdate');
        },
        error: () => this.loaderService.hide(),
      });
  }

  hasFormChanges(): boolean {
    const employment = this.employment();
    const formPositions = this.positions.value;

    if (formPositions.length !== employment.length) {
      return true;
    }

    return formPositions.some((formEmployment, index) => {
      const initial = employment[index];
      if (!initial) return true;

      return hasEmploymentChanges(formEmployment, initial);
    });
  }

  private createEmploymentFormGroup(employment?: Partial<EmploymentForm>): FormGroup {
    const isOngoing = employment?.ongoing ?? false;
    const endDateValidators = isOngoing ? [] : [Validators.required];

    return this.fb.group(
      {
        title: [employment?.title ?? '', CustomValidators.requiredTrimmed()],
        institution: [employment?.institution ?? '', CustomValidators.requiredTrimmed()],
        department: [employment?.department ?? ''],
        startDate: [employment?.startDate ?? null, Validators.required],
        endDate: [employment?.endDate ?? null, endDateValidators],
        ongoing: [employment?.ongoing ?? false],
      },
      { validators: CustomValidators.monthYearRangeValidator }
    );
  }

  private setInitialData(): void {
    const employment = this.employment();
    this.positions.clear();

    if (employment?.length) {
      employment
        .map((x) => mapEmploymentToForm(x))
        .forEach((x) => this.positions.push(this.createEmploymentFormGroup(x)));
    }

    this.cd.markForCheck();
  }
}
