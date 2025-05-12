import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'osf-add-email',
  imports: [InputText, ReactiveFormsModule, Button],
  templateUrl: './add-email.component.html',
  styleUrl: './add-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmailComponent {
  readonly dialogRef = inject(DynamicDialogRef);

  protected readonly emailControl = new FormControl('', [
    Validators.email,
    Validators.required,
  ]);
}
