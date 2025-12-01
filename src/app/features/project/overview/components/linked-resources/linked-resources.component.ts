import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { filter } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { GetLinkedResources, LoadMoreLinkedResources, NodeLinksSelectors } from '@osf/shared/stores/node-links';

import { ProjectOverviewSelectors } from '../../store';
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
  private readonly destroyRef = inject(DestroyRef);

  canEdit = input.required<boolean>();

  linkedResources = select(NodeLinksSelectors.getLinkedResources);
  isLinkedResourcesLoading = select(NodeLinksSelectors.getLinkedResourcesLoading);
  hasMoreLinkedResources = select(NodeLinksSelectors.hasMoreLinkedResources);
  isLoadingMoreLinkedResources = select(NodeLinksSelectors.isLoadingMoreLinkedResources);
  currentProject = select(ProjectOverviewSelectors.getProject);

  private readonly actions = createDispatchMap({
    getLinkedResources: GetLinkedResources,
    loadMoreLinkedResources: LoadMoreLinkedResources,
  });

  openLinkProjectModal() {
    const project = this.currentProject();

    if (!project) return;

    this.customDialogService
      .open(LinkResourceDialogComponent, {
        header: 'project.overview.dialog.linkProject.header',
        width: '850px',
        closable: false,
      })
      .onClose.pipe(
        filter((data) => !!data?.hasChanges),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.actions.getLinkedResources(project.id));
  }

  openDeleteResourceModal(resourceId: string): void {
    const currentLink = this.linkedResources().find((resource) => resource.id === resourceId);
    const project = this.currentProject();

    if (!currentLink || !project) return;

    this.customDialogService
      .open(DeleteNodeLinkDialogComponent, {
        header: 'project.overview.dialog.deleteNodeLink.header',
        width: '650px',
        data: { currentLink },
      })
      .onClose.pipe(
        filter((data) => !!data?.hasChanges),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.actions.getLinkedResources(project.id));
  }

  loadMore(): void {
    const project = this.currentProject();
    if (!project) return;

    this.actions.loadMoreLinkedResources(project.id);
  }
}
