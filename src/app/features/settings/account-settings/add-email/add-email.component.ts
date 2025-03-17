import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';

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
