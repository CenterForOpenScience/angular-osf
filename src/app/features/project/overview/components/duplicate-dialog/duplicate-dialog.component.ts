import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DuplicateProject, ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { ToastService } from '@shared/services';

@Component({
  selector: 'osf-duplicate-dialog',
  imports: [TranslatePipe, Button],
  templateUrl: './duplicate-dialog.component.html',
  styleUrl: './duplicate-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuplicateDialogComponent {
  private store = inject(Store);
  private toastService = inject(ToastService);
  protected dialogRef = inject(DynamicDialogRef);
  protected destroyRef = inject(DestroyRef);
  protected isSubmitting = select(ProjectOverviewSelectors.getDuplicateProjectSubmitting);

  protected handleDuplicateConfirm(): void {
    const project = this.store.selectSnapshot(ProjectOverviewSelectors.getProject);
    if (!project) return;

    this.store
      .dispatch(new DuplicateProject(project.id, project.title))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dialogRef.close();
          this.toastService.showSuccess('project.overview.dialog.toast.duplicate.success');
        },
      });
  }
}
