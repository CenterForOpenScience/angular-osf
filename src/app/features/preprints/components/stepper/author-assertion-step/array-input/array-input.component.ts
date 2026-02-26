import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule, ValidatorFn } from '@angular/forms';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';

@Component({
  selector: 'osf-array-input',
  imports: [ReactiveFormsModule, Button, TextInputComponent, TranslatePipe],
  templateUrl: './array-input.component.html',
  styleUrl: './array-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayInputComponent {
  readonly formArray = input.required<FormArray<FormControl>>();
  readonly inputPlaceholder = input.required<string>();
  readonly validators = input<ValidatorFn[]>([]);

  add(): void {
    this.formArray().push(
      new FormControl('', {
        nonNullable: true,
        validators: this.validators(),
      })
    );
  }

  remove(index: number): void {
    const formArray = this.formArray();

    if (formArray.length > 1) {
      formArray.removeAt(index);
    }
  }
}
