import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { timer } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Education } from '@osf/shared/models/user/education.model';

import { EducationHistoryComponent } from '../education-history/education-history.component';

@Component({
  selector: 'osf-education-history-dialog',
  imports: [Button, TranslatePipe, EducationHistoryComponent],
  templateUrl: './education-history-dialog.component.html',
  styleUrl: './education-history-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationHistoryDialogComponent {
  private readonly config = inject(DynamicDialogConfig);
  dialogRef = inject(DynamicDialogRef);
  readonly educationHistory = signal<Education[]>([]);
  readonly isContentVisible = signal(false);

  constructor() {
    this.educationHistory.set(this.config.data);

    timer(0)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.isContentVisible.set(true));
  }

  close() {
    this.dialogRef.close();
  }
}
