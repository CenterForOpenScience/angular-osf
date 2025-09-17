import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { IconComponent, TruncatedTextComponent } from '@osf/shared/components';
import { IS_MEDIUM } from '@osf/shared/helpers';
import { NodeLinksSelectors } from '@osf/shared/stores';

import { DeleteNodeLinkDialogComponent } from '../delete-node-link-dialog/delete-node-link-dialog.component';
import { LinkResourceDialogComponent } from '../link-resource-dialog/link-resource-dialog.component';

@Component({
  selector: 'osf-linked-resources',
  imports: [Button, Skeleton, TranslatePipe, TruncatedTextComponent, IconComponent, RouterLink],
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

  linkedResources = select(NodeLinksSelectors.getLinkedResources);
  isLinkedResourcesLoading = select(NodeLinksSelectors.getLinkedResourcesLoading);
  isMedium = toSignal(inject(IS_MEDIUM));

  openLinkProjectModal() {
    const dialogWidth = this.isMedium() ? '850px' : '95vw';

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
    const dialogWidth = this.isMedium() ? '650px' : '95vw';

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
        currentLink,
      },
    });
  }

  private getCurrentResourceNodeLink(resourceId: string) {
    return this.linkedResources().find((resource) => resource.id === resourceId);
  }
}
