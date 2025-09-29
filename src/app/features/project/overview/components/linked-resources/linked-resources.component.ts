import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContributorsListComponent, IconComponent, TruncatedTextComponent } from '@osf/shared/components';
import { IS_MEDIUM } from '@osf/shared/helpers';
import { CustomDialogService } from '@osf/shared/services';
import { NodeLinksSelectors } from '@osf/shared/stores';

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
  isMedium = toSignal(inject(IS_MEDIUM));

  openLinkProjectModal() {
    const dialogWidth = this.isMedium() ? '850px' : '95vw';

    this.customDialogService.open(LinkResourceDialogComponent, {
      header: 'project.overview.dialog.linkProject.header',
      width: dialogWidth,
    });
  }

  openDeleteResourceModal(resourceId: string): void {
    const dialogWidth = this.isMedium() ? '650px' : '95vw';

    const currentLink = this.linkedResources().find((resource) => resource.id === resourceId);

    if (!currentLink) return;

    this.customDialogService.open(DeleteNodeLinkDialogComponent, {
      header: 'project.overview.dialog.deleteNodeLink.header',
      width: dialogWidth,
      data: {
        currentLink,
      },
    });
  }
}
