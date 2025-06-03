import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { EducationHistoryComponent } from '@osf/shared/components';
import { Education } from '@osf/shared/models';

@Component({
  selector: 'osf-contributor-education-history',
  imports: [Button, TranslatePipe, EducationHistoryComponent],
  templateUrl: './contributor-education-history.component.html',
  styleUrl: './contributor-education-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorEducationHistoryComponent {
  protected dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  protected readonly educationHistory = signal<Education[]>([]);

  constructor() {
    this.educationHistory.set(this.config.data);
  }

  close() {
    this.dialogRef.close();
  }
}
