import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RadioButton } from 'primeng/radiobutton';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SubmitType } from '../../enums';
import { RegisterDraft, RegistriesSelectors } from '../../store';

@Component({
  selector: 'osf-confirm-registration-dialog',
  imports: [Button, TranslatePipe, ReactiveFormsModule, RadioButton, DatePicker],
  templateUrl: './confirm-registration-dialog.component.html',
  styleUrl: './confirm-registration-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmRegistrationDialogComponent {
  protected readonly dialogRef = inject(DynamicDialogRef);
  private readonly fb = inject(FormBuilder);
  readonly config = inject(DynamicDialogConfig);

  protected readonly isRegistrationSubmitting = select(RegistriesSelectors.isRegistrationSubmitting);
  protected actions = createDispatchMap({
    registerDraft: RegisterDraft,
  });
  SubmitType = SubmitType;
  showDateControl = false;
  minEmbargoDate = computed(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date;
  });

  form: FormGroup = this.fb.group({
    submitOption: [null, Validators.required],
    embargoDate: [{ value: null, disabled: true }],
  });

  constructor() {
    this.form.get('submitOption')!.valueChanges.subscribe((value) => {
      this.showDateControl = value === SubmitType.Embargo;
      const dateControl = this.form.get('embargoDate');

      if (this.showDateControl) {
        dateControl!.enable();
        dateControl!.setValidators(Validators.required);
      } else {
        dateControl!.disable();
        dateControl!.clearValidators();
        dateControl!.reset();
      }

      dateControl!.updateValueAndValidity();
    });
  }

  submit(): void {
    this.actions
      .registerDraft(
        this.config.data.draftId,
        this.form.value.embargoDate,
        this.config.data.providerId,
        this.config.data.projectId,
        this.config.data.components
      )
      .subscribe({
        complete: () => {
          this.dialogRef.close(true);
        },
      });
  }
}
