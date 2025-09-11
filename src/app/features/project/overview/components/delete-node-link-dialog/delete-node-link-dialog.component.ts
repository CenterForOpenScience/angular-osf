import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';

import { ToastService } from '@osf/shared/services';
import { DeleteNodeLink, GetLinkedResources, NodeLinksSelectors } from '@osf/shared/stores';

import { ProjectOverviewSelectors } from '../../store';

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
  dialogRef = inject(DynamicDialogRef);
  destroyRef = inject(DestroyRef);
  currentProject = select(ProjectOverviewSelectors.getProject);
  isSubmitting = select(NodeLinksSelectors.getNodeLinksSubmitting);

  actions = createDispatchMap({ deleteNodeLink: DeleteNodeLink, getLinkedResources: GetLinkedResources });

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
