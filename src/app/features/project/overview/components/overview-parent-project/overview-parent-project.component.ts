import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ContributorsListComponent, IconComponent, TruncatedTextComponent } from '@osf/shared/components';

import { ProjectOverview } from '../../models';

@Component({
  selector: 'osf-overview-parent-project',
  imports: [Skeleton, TranslatePipe, IconComponent, TruncatedTextComponent, Button, Menu, ContributorsListComponent],
  templateUrl: './overview-parent-project.component.html',
  styleUrl: './overview-parent-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewParentProjectComponent {
  isLoading = input<boolean>(false);
  project = input.required<ProjectOverview>();

  private router = inject(Router);
  currentUser = select(UserSelectors.getCurrentUser);

  menuItems = [
    {
      label: 'project.overview.actions.manageContributors',
      action: 'manageContributors',
    },
    {
      label: 'project.overview.actions.settings',
      action: 'settings',
    },
  ];

  get isCurrentUserContributor() {
    return () => {
      const userId = this.currentUser()?.id;
      return userId ? this.project()?.contributors.some((contributor) => contributor.userId === userId) : false;
    };
  }

  handleMenuAction(action: string): void {
    const projectId = this.project()?.id;
    if (!projectId) {
      return;
    }
    switch (action) {
      case 'manageContributors':
        this.router.navigate([projectId, 'contributors']);
        break;
      case 'settings':
        this.router.navigate([projectId, 'settings']);
        break;
    }
  }
}
