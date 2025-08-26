import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { finalize } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ToolbarResource } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';

import { ForkResource, ProjectOverviewSelectors } from '../../store';

@Component({
  selector: 'osf-fork-dialog',
  imports: [TranslatePipe, Button],
  templateUrl: './fork-dialog.component.html',
  styleUrl: './fork-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForkDialogComponent {
  private store = inject(Store);
  private toastService = inject(ToastService);
  protected dialogRef = inject(DynamicDialogRef);
  protected destroyRef = inject(DestroyRef);
  protected isSubmitting = select(ProjectOverviewSelectors.getForkProjectSubmitting);
  readonly config = inject(DynamicDialogConfig);

  protected handleForkConfirm(): void {
    const resource = this.config.data.resource as ToolbarResource;
    if (!resource) return;

    this.store
      .dispatch(new ForkResource(resource.id, resource.resourceType))
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
