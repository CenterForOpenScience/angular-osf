import { select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

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
  private translateService = inject(TranslateService);
  private toastService = inject(ToastService);
  protected dialogRef = inject(DynamicDialogRef);
  protected isSubmitting = select(ProjectOverviewSelectors.getDuplicateProjectSubmitting);

  protected handleDuplicateConfirm(): void {
    const project = this.store.selectSnapshot(ProjectOverviewSelectors.getProject);
    if (!project) return;

    this.store.dispatch(new DuplicateProject(project.id, project.title)).subscribe({
      next: () => {
        this.dialogRef.close();
        this.toastService.showSuccess(this.translateService.instant('project.overview.dialog.toast.duplicate.success'));
      },
    });
  }
}
