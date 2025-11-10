import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';

import { ParentProjectModel } from '../../models/parent-overview.model';

@Component({
  selector: 'osf-overview-parent-project',
  imports: [Skeleton, TranslatePipe, IconComponent, TruncatedTextComponent, Button, Menu, ContributorsListComponent],
  templateUrl: './overview-parent-project.component.html',
  styleUrl: './overview-parent-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewParentProjectComponent {
  project = input.required<ParentProjectModel>();
  anonymous = input<boolean>(false);
  isLoading = input<boolean>(false);

  router = inject(Router);

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

  navigateToParent(): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/', this.project().id], { queryParamsHandling: 'preserve' })
    );

    window.open(url, '_self');
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
