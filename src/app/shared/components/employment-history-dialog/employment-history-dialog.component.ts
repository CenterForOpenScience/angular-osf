import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { timer } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Employment } from '@osf/shared/models/user/employment.model';

import { EmploymentHistoryComponent } from '../employment-history/employment-history.component';

@Component({
  selector: 'osf-employment-history-dialog',
  imports: [Button, TranslatePipe, EmploymentHistoryComponent],
  templateUrl: './employment-history-dialog.component.html',
  styleUrl: './employment-history-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentHistoryDialogComponent {
  dialogRef = inject(DynamicDialogRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly employmentHistory = signal<Employment[]>([]);
  readonly isContentVisible = signal(false);

  constructor() {
    this.employmentHistory.set(this.config.data);

    timer(0)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isContentVisible.set(true));
  }

  close() {
    this.dialogRef.close();
  }
}
