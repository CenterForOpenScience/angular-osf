import { select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ForkProject, ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { ToastService } from '@shared/services';

@Component({
  selector: 'osf-fork-dialog',
  imports: [TranslatePipe, Button],
  templateUrl: './fork-dialog.component.html',
  styleUrl: './fork-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForkDialogComponent {
  private store = inject(Store);
  private translateService = inject(TranslateService);
  private toastService = inject(ToastService);
  protected dialogRef = inject(DynamicDialogRef);
  protected destroyRef = inject(DestroyRef);
  protected isSubmitting = select(ProjectOverviewSelectors.getForkProjectSubmitting);

  protected handleForkConfirm(): void {
    const project = this.store.selectSnapshot(ProjectOverviewSelectors.getProject);
    if (!project) return;

    this.store
      .dispatch(new ForkProject(project.id))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dialogRef.close();
          this.toastService.showSuccess(this.translateService.instant('project.overview.dialog.toast.fork.success'));
        },
      });
  }
}
