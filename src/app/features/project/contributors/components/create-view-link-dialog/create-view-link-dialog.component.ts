import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'osf-create-view-link-dialog',
  imports: [Button, TranslatePipe, InputText, ReactiveFormsModule, FormsModule, Checkbox],
  templateUrl: './create-view-link-dialog.component.html',
  styleUrl: './create-view-link-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateViewLinkDialogComponent {
  dialogRef = inject(DynamicDialogRef);
  protected linkName = signal('');
  anonymous = signal(true);
  componentExample1 = signal(true);
  componentExample2 = signal(false);
  componentExample3 = signal(false);

  addContributor(): void {
    this.dialogRef.close();
  }

  onLinkNameChange(value: string): void {
    this.linkName.set(value);
  }
}
