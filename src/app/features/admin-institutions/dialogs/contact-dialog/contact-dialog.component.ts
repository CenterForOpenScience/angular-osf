import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RadioButton } from 'primeng/radiobutton';
import { SelectButton } from 'primeng/selectbutton';
import { Textarea } from 'primeng/textarea';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CustomValidators } from '@osf/shared/helpers';

import { CONTACT_OPTIONS } from '../../constants';
import { ContactOption, ProjectPermission } from '../../enums';
import { ContactDialogData } from '../../models';

@Component({
  selector: 'osf-contact-dialog',
  imports: [ReactiveFormsModule, FormsModule, SelectButton, RadioButton, Button, Textarea, Checkbox, TranslatePipe],
  templateUrl: './contact-dialog.component.html',
  styleUrl: './contact-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactDialogComponent {
  selectedOption = signal<ContactOption>(ContactOption.RequestAccess);

  contactOptions = CONTACT_OPTIONS;
  projectPermission = ProjectPermission;

  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly fb = inject(FormBuilder);
  readonly config = inject(DynamicDialogConfig);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      permission: [''],
      emailContent: [''],
      ccSender: [false],
      allowReplyToSender: [false],
    });

    this.updateValidation();
  }

  get isRequestAccess(): boolean {
    return this.selectedOption() === ContactOption.RequestAccess;
  }

  onOptionChange(option: ContactOption): void {
    if (this.selectedOption() === option) {
      return;
    }

    this.selectedOption.set(option);
    this.form.reset();
    this.updateValidation();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSend(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;
    const data: ContactDialogData = {
      emailContent: formValue.emailContent,
      selectedOption: this.selectedOption(),
      permission: formValue.permission,
      ccSender: formValue.ccSender || false,
      allowReplyToSender: formValue.allowReplyToSender || false,
    };

    this.dialogRef.close(data);
  }

  private updateValidation(): void {
    const emailControl = this.form.get('emailContent')!;
    const permissionControl = this.form.get('permission')!;

    if (this.isRequestAccess) {
      permissionControl.setValidators(Validators.required);
      emailControl.clearValidators();
    } else {
      permissionControl.clearValidators();
      emailControl.setValidators([CustomValidators.requiredTrimmed()]);
    }

    permissionControl.updateValueAndValidity();
    emailControl.updateValueAndValidity();
  }
}
