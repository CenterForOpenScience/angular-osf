import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { GetResourceWithChildren } from '@osf/shared/stores/current-resource';
import { ComponentOverview } from '@shared/models/components/components.models';

import { LoadMoreComponents, ProjectOverviewSelectors } from '../../store';
import { AddComponentDialogComponent } from '../add-component-dialog/add-component-dialog.component';
import { DeleteComponentDialogComponent } from '../delete-component-dialog/delete-component-dialog.component';

@Component({
  selector: 'osf-project-components',
  imports: [Button, Menu, Skeleton, TranslatePipe, TruncatedTextComponent, IconComponent, ContributorsListComponent],
  templateUrl: './overview-components.component.html',
  styleUrl: './overview-components.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponentsComponent {
  private router = inject(Router);
  private customDialogService = inject(CustomDialogService);
  private loaderService = inject(LoaderService);

  canEdit = input.required<boolean>();
  anonymous = input<boolean>(false);

  components = select(ProjectOverviewSelectors.getComponents);
  isComponentsLoading = select(ProjectOverviewSelectors.getComponentsLoading);
  hasMoreComponents = select(ProjectOverviewSelectors.hasMoreComponents);
  project = select(ProjectOverviewSelectors.getProject);

  actions = createDispatchMap({
    getComponentsTree: GetResourceWithChildren,
    loadMoreComponents: LoadMoreComponents,
  });

  readonly UserPermissions = UserPermissions;

  readonly componentActionItems = (component: ComponentOverview) => {
    const baseItems = [
      {
        label: 'project.overview.actions.manageContributors',
        action: 'manageContributors',
        componentId: component.id,
      },
      {
        label: 'project.overview.actions.settings',
        action: 'settings',
        componentId: component.id,
      },
    ];

    if (component.currentUserPermissions.includes(UserPermissions.Admin)) {
      baseItems.push({
        label: 'project.overview.actions.delete',
        action: 'delete',
        componentId: component.id,
      });
    }

    return baseItems;
  };

  handleMenuAction(action: string, componentId: string): void {
    switch (action) {
      case 'manageContributors':
        this.router.navigate([componentId, 'contributors']);
        break;
      case 'settings':
        this.router.navigate([componentId, 'settings']);
        break;
      case 'delete':
        this.handleDeleteComponent(componentId);
        break;
    }
  }

  handleAddComponent(): void {
    this.customDialogService.open(AddComponentDialogComponent, {
      header: 'project.overview.dialog.addComponent.header',
      width: '850px',
    });
  }

  navigateToComponent(componentId: string): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/', componentId], { queryParamsHandling: 'preserve' })
    );

    window.open(url, '_self');
  }

  loadMoreComponents(): void {
    const project = this.project();
    if (!project) return;

    this.actions.loadMoreComponents(project.id);
  }

  private handleDeleteComponent(componentId: string): void {
    const project = this.project();
    if (!project) return;

    this.loaderService.show();

    this.actions.getComponentsTree(project.rootParentId || project.id, componentId, ResourceType.Project).subscribe({
      next: () => {
        this.loaderService.hide();
        this.customDialogService.open(DeleteComponentDialogComponent, {
          header: 'project.overview.dialog.deleteComponent.header',
          width: '650px',
          data: { componentId, resourceType: ResourceType.Project },
        });
      },
      error: () => {
        this.loaderService.hide();
      },
    });
  }
}
