import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RadioButton } from 'primeng/radiobutton';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  readonly config = inject(DynamicDialogConfig);
  readonly dialogRef = inject(DynamicDialogRef);
  readonly destroyRef = inject(DestroyRef);
  readonly fb = inject(FormBuilder);

  readonly isRegistrationSubmitting = select(RegistriesSelectors.isRegistrationSubmitting);
  actions = createDispatchMap({ registerDraft: RegisterDraft });
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
    this.form
      .get('submitOption')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
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
    const embargoDate = this.form.value.embargoDate ? new Date(this.form.value.embargoDate)?.toISOString() : '';
    this.form.disable();

    this.actions
      .registerDraft(
        this.config.data.draftId,
        embargoDate,
        this.config.data.providerId,
        this.config.data.projectId,
        this.config.data.components
      )
      .subscribe({
        error: () => this.form.enable(),
        complete: () => this.dialogRef.close(true),
      });
  }
}
