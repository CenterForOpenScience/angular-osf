import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { finalize } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ToastService } from '@osf/shared/services/toast.service';

import { ForkResource, ProjectOverviewSelectors } from '../../store';

@Component({
  selector: 'osf-fork-dialog',
  imports: [TranslatePipe, Button],
  templateUrl: './fork-dialog.component.html',
  styleUrl: './fork-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForkDialogComponent {
  private toastService = inject(ToastService);
  dialogRef = inject(DynamicDialogRef);
  destroyRef = inject(DestroyRef);
  readonly config = inject(DynamicDialogConfig);

  isSubmitting = select(ProjectOverviewSelectors.getForkProjectSubmitting);

  actions = createDispatchMap({ forkResource: ForkResource });

  handleForkConfirm(): void {
    const resourceId = this.config.data.resourceId as string;
    const resourceType = this.config.data.resourceType as ResourceType;

    if (!resourceId || !resourceType) return;

    this.actions
      .forkResource(resourceId, resourceType)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.dialogRef.close({ success: true });
          this.toastService.showSuccess('project.overview.dialog.toast.fork.success');
        })
      )
      .subscribe();
  }
}
