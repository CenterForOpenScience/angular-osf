import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, effect, HostBinding, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Employment } from '@osf/shared/models';
import { CustomValidators } from '@osf/shared/utils';

import { EmploymentForm } from '../../models';
import { ProfileSettingsSelectors, UpdateProfileSettingsEmployment } from '../../store';

@Component({
  selector: 'osf-employment',
  imports: [Button, Checkbox, DatePicker, InputText, ReactiveFormsModule, TranslatePipe],
  templateUrl: './employment.component.html',
  styleUrl: './employment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentComponent {
  @HostBinding('class') classes = 'flex flex-column gap-5';

  readonly actions = createDispatchMap({ updateProfileSettingsEmployment: UpdateProfileSettingsEmployment });
  readonly employment = select(ProfileSettingsSelectors.employment);

  readonly fb = inject(FormBuilder);
  readonly employmentForm = this.fb.group({ positions: this.fb.array<EmploymentForm>([]) });

  constructor() {
    effect(() => {
      const employment = this.employment();

      if (employment && employment.length > 0) {
        this.positions.clear();

        employment.forEach((position) => {
          const positionGroup = this.fb.group({
            title: [position.title, Validators.required],
            department: [position.department],
            institution: [position.institution, Validators.required],
            startDate: [new Date(+position.startYear, position.startMonth - 1)],
            endDate: position.ongoing
              ? ''
              : position.endYear && position.endMonth
                ? [new Date(+position.endYear, position.endMonth - 1)]
                : null,
            ongoing: !position.ongoing,
          });

          this.positions.push(positionGroup);
        });
      }
    });
  }

  get positions(): FormArray {
    return this.employmentForm.get('positions') as FormArray;
  }

  addPosition(): void {
    const positionGroup = this.fb.group({
      title: ['', CustomValidators.requiredTrimmed()],
      department: [''],
      institution: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      ongoing: [false],
    });

    this.positions.push(positionGroup);
  }

  removePosition(index: number): void {
    this.positions.removeAt(index);
  }

  handleSavePositions(): void {
    const employments = this.positions.value as EmploymentForm[];

    const formattedEmployments = employments.map((employment) => ({
      title: employment.title,
      department: employment.department,
      institution: employment.institution,
      startYear: this.setupDates(employment.startDate, null).startYear,
      startMonth: this.setupDates(employment.startDate, null).startMonth,
      endYear: employment.ongoing ? null : this.setupDates('', employment.endDate).endYear,
      endMonth: employment.ongoing ? null : this.setupDates('', employment.endDate).endMonth,
      ongoing: !employment.ongoing,
    })) satisfies Employment[];

    this.actions.updateProfileSettingsEmployment({ employment: formattedEmployments });
  }

  private setupDates(
    startDate: Date | string,
    endDate: Date | string | null
  ): {
    startYear: string | number;
    startMonth: number;
    endYear: number | null;
    endMonth: number | null;
  } {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    return {
      startYear: start.getFullYear(),
      startMonth: start.getMonth() + 1,
      endYear: end ? end.getFullYear() : null,
      endMonth: end ? end.getMonth() + 1 : null,
    };
  }
}
