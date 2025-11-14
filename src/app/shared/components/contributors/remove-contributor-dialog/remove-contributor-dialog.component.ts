import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RadioButton } from 'primeng/radiobutton';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'osf-remove-contributor-dialog',
  imports: [RadioButton, FormsModule, Button, TranslatePipe],
  templateUrl: './remove-contributor-dialog.component.html',
  styleUrl: './remove-contributor-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveContributorDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);
  selectedOption = false;

  get messageKey(): string | undefined {
    return this.config?.data?.messageKey as string | undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get messageParams(): any {
    return this.config?.data?.messageParams;
  }

  confirm(): void {
    this.dialogRef.close(this.selectedOption);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
