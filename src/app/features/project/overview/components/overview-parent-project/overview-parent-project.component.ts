import { TranslatePipe } from '@ngx-translate/core';

import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { NodeMenuAction } from '@osf/shared/enums/node-menu-action.enum';
import { NodeModel } from '@osf/shared/models/nodes/base-node.model';

import { ComponentCardComponent } from '../component-card/component-card.component';

@Component({
  selector: 'osf-overview-parent-project',
  imports: [Skeleton, TranslatePipe, ComponentCardComponent],
  templateUrl: './overview-parent-project.component.html',
  styleUrl: './overview-parent-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewParentProjectComponent {
  project = input.required<NodeModel>();
  anonymous = input<boolean>(false);
  isLoading = input<boolean>(false);

  router = inject(Router);

  navigateToParent(): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/', this.project().id], { queryParamsHandling: 'preserve' })
    );

    window.open(url, '_self');
  }

  handleMenuAction(action: NodeMenuAction): void {
    const projectId = this.project().id;

    if (!projectId) {
      return;
    }

    switch (action) {
      case NodeMenuAction.ManageContributors:
        this.router.navigate([projectId, 'contributors']);
        break;
      case NodeMenuAction.Settings:
        this.router.navigate([projectId, 'settings']);
        break;
    }
  }
}
