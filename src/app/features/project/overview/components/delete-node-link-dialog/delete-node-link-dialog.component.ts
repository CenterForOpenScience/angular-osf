import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';

import { ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { ToastService } from '@shared/services';
import { DeleteNodeLink, GetLinkedResources, NodeLinksSelectors } from '@shared/stores';

@Component({
  selector: 'osf-delete-node-link-dialog',
  imports: [Button, TranslatePipe],
  templateUrl: './delete-node-link-dialog.component.html',
  styleUrl: './delete-node-link-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteNodeLinkDialogComponent {
  private toastService = inject(ToastService);
  private dialogConfig = inject(DynamicDialogConfig);
  protected dialogRef = inject(DynamicDialogRef);
  protected destroyRef = inject(DestroyRef);
  protected currentProject = select(ProjectOverviewSelectors.getProject);
  protected isSubmitting = select(NodeLinksSelectors.getNodeLinksSubmitting);

  protected actions = createDispatchMap({ deleteNodeLink: DeleteNodeLink, getLinkedResources: GetLinkedResources });

  handleDeleteNodeLink(): void {
    const project = this.currentProject();
    const currentLink = this.dialogConfig.data.currentLink;

    if (!currentLink || !project) return;

    this.actions.deleteNodeLink(project.id, currentLink).subscribe({
      next: () => {
        this.dialogRef.close();
        this.actions.getLinkedResources(project.id);
        this.toastService.showSuccess('project.overview.dialog.toast.deleteNodeLink.success');
      },
    });
  }
}
