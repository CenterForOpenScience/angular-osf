import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { DeleteNodeLinkDialogComponent, LinkResourceDialogComponent } from '@osf/features/project/overview/components';
import { TruncatedTextComponent } from '@osf/shared/components';
import { NodeLinksSelectors } from '@shared/stores';
import { IS_XSMALL } from '@shared/utils';

@Component({
  selector: 'osf-linked-resources',
  imports: [Button, NgClass, Skeleton, TranslatePipe, TruncatedTextComponent],
  templateUrl: './linked-resources.component.html',
  styleUrl: './linked-resources.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedResourcesComponent {
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  isCollectionsRoute = input<boolean>(false);
  canWrite = input.required<boolean>();
  protected linkedResources = select(NodeLinksSelectors.getLinkedResources);
  protected isLinkedResourcesLoading = select(NodeLinksSelectors.getLinkedResourcesLoading);
  protected isMobile = toSignal(inject(IS_XSMALL));
  protected nodeLinks = select(NodeLinksSelectors.getNodeLinks);

  openLinkProjectModal() {
    const dialogWidth = this.isMobile() ? '95vw' : '850px';

    this.dialogService.open(LinkResourceDialogComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant('project.overview.dialog.linkProject.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  openDeleteResourceModal(resourceId: string): void {
    const dialogWidth = this.isMobile() ? '95vw' : '650px';

    const currentLink = this.getCurrentResourceNodeLink(resourceId);

    if (!currentLink) return;

    this.dialogService.open(DeleteNodeLinkDialogComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant('project.overview.dialog.deleteNodeLink.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        nodeLinkId: currentLink.id,
      },
    });
  }

  private getCurrentResourceNodeLink(resourceId: string) {
    return this.nodeLinks().find((link) => link.targetNode.id === resourceId);
  }
}
