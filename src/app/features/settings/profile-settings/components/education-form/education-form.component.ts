import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';

import { filter } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components';
import { InputLimits } from '@osf/shared/constants';

import { MAX_DATE, MIN_DATE } from '../../constants';

@Component({
  selector: 'osf-education-form',
  imports: [ReactiveFormsModule, Button, InputText, DatePicker, Checkbox, Message, TranslatePipe, TextInputComponent],
  templateUrl: './education-form.component.html',
  styleUrl: './education-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationFormComponent implements OnInit {
  readonly maxDate = MAX_DATE;
  readonly minDate = MIN_DATE;
  readonly institutionMaxLength = InputLimits.fullName.maxLength;
  readonly dateFormat = 'mm/dd/yy';

  private readonly destroyRef = inject(DestroyRef);

  group = input.required<FormGroup>();
  index = input.required<number>();
  remove = output<void>();

  get institutionControl() {
    return this.group().controls['institution'] as FormControl;
  }

  get isDateError() {
    const form = this.group();
    return form.errors && form.errors['dateRangeInvalid'];
  }

  ngOnInit() {
    this.group()
      .controls['ongoing'].valueChanges.pipe(
        filter((res) => !!res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.group().controls['endDate'].setValue(null));
  }
}
