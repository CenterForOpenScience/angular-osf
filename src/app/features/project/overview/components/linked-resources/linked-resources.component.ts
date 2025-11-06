import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { NodeLinksSelectors } from '@osf/shared/stores/node-links';

import { DeleteNodeLinkDialogComponent } from '../delete-node-link-dialog/delete-node-link-dialog.component';
import { LinkResourceDialogComponent } from '../link-resource-dialog/link-resource-dialog.component';

@Component({
  selector: 'osf-linked-resources',
  imports: [Button, Skeleton, TranslatePipe, TruncatedTextComponent, IconComponent, ContributorsListComponent],
  templateUrl: './linked-resources.component.html',
  styleUrl: './linked-resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedResourcesComponent {
  private customDialogService = inject(CustomDialogService);

  canEdit = input.required<boolean>();

  linkedResources = select(NodeLinksSelectors.getLinkedResources);
  isLinkedResourcesLoading = select(NodeLinksSelectors.getLinkedResourcesLoading);

  openLinkProjectModal() {
    this.customDialogService.open(LinkResourceDialogComponent, {
      header: 'project.overview.dialog.linkProject.header',
      width: '850px',
    });
  }

  openDeleteResourceModal(resourceId: string): void {
    const currentLink = this.linkedResources().find((resource) => resource.id === resourceId);

    if (!currentLink) return;

    this.customDialogService.open(DeleteNodeLinkDialogComponent, {
      header: 'project.overview.dialog.deleteNodeLink.header',
      width: '650px',
      data: { currentLink },
    });
  }
}
