import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Textarea } from 'primeng/textarea';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RemoveFromCollectionDialogResult } from '@osf/features/collections/models/remove-from-collection-dialog-result.model';
import { InputLimits } from '@osf/shared/constants/input-limits.const';

@Component({
  selector: 'osf-remove-from-collection-dialog',
  imports: [Button, Textarea, TranslatePipe, FormsModule],
  templateUrl: './remove-from-collection-dialog.component.html',
  styleUrl: './remove-from-collection-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveFromCollectionDialogComponent {
  readonly config = inject(DynamicDialogConfig);
  readonly dialogRef = inject(DynamicDialogRef);

  readonly projectTitle = this.config.data.projectTitle;
  readonly comment = signal<string>('');
  readonly commentLimit = InputLimits.decisionComment.maxLength;

  confirm(): void {
    const result: RemoveFromCollectionDialogResult = {
      confirmed: true,
      comment: this.comment(),
    };

    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
