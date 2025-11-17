import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ToastService } from '@osf/shared/services/toast.service';

import { DuplicateProject, ProjectOverviewSelectors } from '../../store';

@Component({
  selector: 'osf-duplicate-dialog',
  imports: [TranslatePipe, Button],
  templateUrl: './duplicate-dialog.component.html',
  styleUrl: './duplicate-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuplicateDialogComponent {
  private toastService = inject(ToastService);

  dialogRef = inject(DynamicDialogRef);
  destroyRef = inject(DestroyRef);

  project = select(ProjectOverviewSelectors.getProject);
  isSubmitting = select(ProjectOverviewSelectors.getDuplicateProjectSubmitting);

  actions = createDispatchMap({ duplicateProject: DuplicateProject });

  handleDuplicateConfirm(): void {
    const project = this.project();

    if (!project) return;

    this.actions
      .duplicateProject(project.id, project.title)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dialogRef.close();
          this.toastService.showSuccess('project.overview.dialog.toast.duplicate.success');
        },
      });
  }
}
