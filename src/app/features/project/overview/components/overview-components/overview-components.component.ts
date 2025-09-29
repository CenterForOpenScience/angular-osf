import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Menu } from 'primeng/menu';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ContributorsListComponent, IconComponent, TruncatedTextComponent } from '@osf/shared/components';
import { ResourceType, UserPermissions } from '@osf/shared/enums';
import { IS_XSMALL } from '@osf/shared/helpers';
import { ComponentOverview } from '@shared/models';

import { ProjectOverviewSelectors } from '../../store';
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
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  isMobile = toSignal(inject(IS_XSMALL));

  canEdit = input.required<boolean>();

  currentUser = select(UserSelectors.getCurrentUser);
  currentUserId = computed(() => this.currentUser()?.id);
  components = select(ProjectOverviewSelectors.getComponents);
  isComponentsLoading = select(ProjectOverviewSelectors.getComponentsLoading);

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
  readonly UserPermissions = UserPermissions;

  get isCurrentUserContributor() {
    return (component: ComponentOverview) => {
      const userId = this.currentUserId();
      return userId ? component.contributors.some((contributor) => contributor.userId === userId) : false;
    };
  }

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
    const dialogWidth = this.isMobile() ? '95vw' : '850px';

    this.dialogService.open(AddComponentDialogComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant('project.overview.dialog.addComponent.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  private handleDeleteComponent(componentId: string): void {
    const dialogWidth = this.isMobile() ? '95vw' : '650px';

    this.dialogService.open(DeleteComponentDialogComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant('project.overview.dialog.deleteComponent.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        componentId,
        resourceType: ResourceType.Project,
      },
    });
  }
}
