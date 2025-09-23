import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Education } from '@osf/shared/models';

import { EducationHistoryComponent } from '../education-history/education-history.component';

@Component({
  selector: 'osf-education-history-dialog',
  imports: [Button, TranslatePipe, EducationHistoryComponent],
  templateUrl: './education-history-dialog.component.html',
  styleUrl: './education-history-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationHistoryDialogComponent implements AfterViewInit {
  private readonly config = inject(DynamicDialogConfig);
  dialogRef = inject(DynamicDialogRef);
  readonly educationHistory = signal<Education[]>([]);
  readonly isContentVisible = signal(false);

  constructor() {
    this.educationHistory.set(this.config.data);
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.isContentVisible.set(true));
  }

  close() {
    this.dialogRef.close();
  }
}
