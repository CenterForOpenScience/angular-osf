import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { Checkbox } from 'primeng/checkbox';

enum EducationFormControls {
  Institution = 'institution',
  Department = 'department',
  Degree = 'degree',
  StartDate = 'startDate',
  EndDate = 'endDate',
  onGoing = 'onGoing',
}

interface EducationForm {
  [EducationFormControls.Institution]: FormControl<string>;
  [EducationFormControls.Department]: FormControl<string>;
  [EducationFormControls.Degree]: FormControl<string>;
  [EducationFormControls.StartDate]: FormControl<Date>;
  [EducationFormControls.EndDate]: FormControl<Date>;
  [EducationFormControls.onGoing]: FormControl<boolean>;
}

@Component({
  selector: 'osf-education',
  imports: [ReactiveFormsModule, Button, InputText, DatePicker, Checkbox],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationComponent {
  @HostBinding('class') classes = 'flex flex-column gap-5';
  readonly #fb = inject(FormBuilder);
  protected readonly educationFormControls = EducationFormControls;

  protected readonly educationForm = this.#fb.group({
    educations: this.#fb.array<EducationForm>([]),
  });

  get educations() {
    return this.educationForm.get('educations') as FormArray;
  }

  removeEducation(index: number): void {
    this.educations.removeAt(index);
  }

  addEducation(): void {
    const newEducation = this.#fb.group({
      [EducationFormControls.Institution]: [''],
      [EducationFormControls.Department]: [''],
      [EducationFormControls.Degree]: [''],
      [EducationFormControls.StartDate]: [null],
      [EducationFormControls.EndDate]: [null],
      [EducationFormControls.onGoing]: [false],
    });
    this.educations.push(newEducation);
  }

  saveEducation(): void {
    const educationData = this.educations.value;
    console.log('Saved Education Data:', educationData);
  }
}
