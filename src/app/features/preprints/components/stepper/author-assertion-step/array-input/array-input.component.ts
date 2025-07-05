import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule, ValidatorFn } from '@angular/forms';

import { TextInputComponent } from '@shared/components';

@Component({
  selector: 'osf-array-input',
  imports: [ReactiveFormsModule, Button, TextInputComponent],
  templateUrl: './array-input.component.html',
  styleUrl: './array-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayInputComponent {
  formArray = input.required<FormArray<FormControl>>();
  inputPlaceholder = input.required<string>();
  validators = input.required<ValidatorFn[]>();

  add() {
    this.formArray().push(
      new FormControl('', {
        nonNullable: true,
        validators: this.validators(),
      })
    );
  }

  remove(index: number) {
    if (this.formArray().length > 1) {
      this.formArray().removeAt(index);
    }
  }
}
