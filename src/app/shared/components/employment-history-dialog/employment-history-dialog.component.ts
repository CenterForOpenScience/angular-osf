import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { timer } from 'rxjs';

import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Employment } from '@osf/shared/models';

import { EmploymentHistoryComponent } from '../employment-history/employment-history.component';

@Component({
  selector: 'osf-employment-history-dialog',
  imports: [Button, TranslatePipe, EmploymentHistoryComponent],
  templateUrl: './employment-history-dialog.component.html',
  styleUrl: './employment-history-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentHistoryDialogComponent implements AfterViewInit {
  private readonly config = inject(DynamicDialogConfig);
  dialogRef = inject(DynamicDialogRef);
  readonly employmentHistory = signal<Employment[]>([]);
  readonly isContentVisible = signal(false);

  constructor() {
    this.employmentHistory.set(this.config.data);
  }

  ngAfterViewInit(): void {
    timer(0)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.isContentVisible.set(true));
  }

  close() {
    this.dialogRef.close();
  }
}
