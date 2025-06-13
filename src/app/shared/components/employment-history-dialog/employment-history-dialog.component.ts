import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { EmploymentHistoryComponent } from '@osf/shared/components';
import { Employment } from '@osf/shared/models';

@Component({
  selector: 'osf-employment-history-dialog',
  imports: [Button, TranslatePipe, EmploymentHistoryComponent],
  templateUrl: './employment-history-dialog.component.html',
  styleUrl: './employment-history-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentHistoryDialogComponent {
  private readonly config = inject(DynamicDialogConfig);
  protected dialogRef = inject(DynamicDialogRef);
  protected readonly employmentHistory = signal<Employment[]>([]);

  constructor() {
    this.employmentHistory.set(this.config.data);
  }

  close() {
    this.dialogRef.close();
  }
}
