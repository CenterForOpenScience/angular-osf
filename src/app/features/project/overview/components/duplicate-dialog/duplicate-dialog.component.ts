import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { tap } from 'rxjs';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DuplicateProject, ProjectOverviewSelectors } from '@osf/features/project/overview/store';

@Component({
  selector: 'osf-duplicate-dialog',
  imports: [TranslatePipe, Button],
  templateUrl: './duplicate-dialog.component.html',
  styleUrl: './duplicate-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuplicateDialogComponent {
  private store = inject(Store);
  protected dialogRef = inject(DynamicDialogRef);
  protected isSubmitting = select(ProjectOverviewSelectors.getDuplicateProjectSubmitting);

  protected handleDuplicateConfirm(): void {
    const project = this.store.selectSnapshot(ProjectOverviewSelectors.getProject);
    if (!project) return;

    this.store
      .dispatch(new DuplicateProject(project.id, project.title))
      .pipe(tap(() => this.dialogRef.close()))
      .subscribe();
  }
}
