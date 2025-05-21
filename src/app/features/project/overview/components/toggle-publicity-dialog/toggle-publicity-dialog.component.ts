import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { tap } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ProjectOverviewSelectors, UpdateProjectPublicStatus } from '@osf/features/project/overview/store';

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
  protected dialogRef = inject(DynamicDialogRef);
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
      .pipe(tap(() => this.dialogRef.close()))
      .subscribe();
  }
}
