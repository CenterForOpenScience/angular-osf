import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Employment } from '@osf/shared/models';

import { EmploymentHistoryComponent } from '../employment-history/employment-history.component';

@Component({
  selector: 'osf-employment-history-dialog',
  imports: [Button, TranslatePipe, EmploymentHistoryComponent],
  templateUrl: './employment-history-dialog.component.html',
  styleUrl: './employment-history-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentHistoryDialogComponent {
  private readonly config = inject(DynamicDialogConfig);
  readonly employmentHistory = signal<Employment[]>([]);
  dialogRef = inject(DynamicDialogRef);

  constructor() {
    this.employmentHistory.set(this.config.data);
  }

  close() {
    this.dialogRef.close();
  }
}
