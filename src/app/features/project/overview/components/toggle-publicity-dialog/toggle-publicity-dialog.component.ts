import { select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProjectOverviewSelectors, UpdateProjectPublicStatus } from '@osf/features/project/overview/store';
import { ToastService } from '@shared/services';

@Component({
  selector: 'osf-toggle-publicity-dialog',
  imports: [Button, TranslatePipe],
  templateUrl: './toggle-publicity-dialog.component.html',
  styleUrl: './toggle-publicity-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TogglePublicityDialogComponent {
  private store = inject(Store);
  private dialogConfig = inject(DynamicDialogConfig);
  private translateService = inject(TranslateService);
  private toastService = inject(ToastService);
  protected dialogRef = inject(DynamicDialogRef);
  protected destroyRef = inject(DestroyRef);
  protected isSubmitting = select(ProjectOverviewSelectors.getUpdatePublicStatusSubmitting);
  private newPublicStatus = signal(this.dialogConfig.data.newPublicStatus);
  private projectId = signal(this.dialogConfig.data.projectId);
  protected isCurrentlyPublic = signal(this.dialogConfig.data.isCurrentlyPublic);
  protected messageKey = computed(() => {
    return this.isCurrentlyPublic()
      ? 'project.overview.dialog.makePrivate.message'
      : 'project.overview.dialog.makePublic.message';
  });

  toggleProjectPublicity() {
    this.store
      .dispatch(new UpdateProjectPublicStatus(this.projectId(), this.newPublicStatus()))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dialogRef.close();
          this.toastService.showSuccess(
            this.translateService.instant(
              this.newPublicStatus()
                ? 'project.overview.dialog.toast.makePublic.success'
                : 'project.overview.dialog.toast.makePrivate.success'
            )
          );
        },
      });
  }
}
