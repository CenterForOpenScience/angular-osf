import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { EmploymentHistoryComponent } from '@osf/shared/components';
import { Employment } from '@osf/shared/models';

@Component({
  selector: 'osf-contributor-employment-history',
  imports: [Button, TranslatePipe, EmploymentHistoryComponent],
  templateUrl: './contributor-employment-history.component.html',
  styleUrl: './contributor-employment-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorEmploymentHistoryComponent {
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
