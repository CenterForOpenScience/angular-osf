import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';

import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { NodeMenuAction } from '@osf/shared/enums/node-menu-action.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { NodeModel } from '@osf/shared/models/nodes/base-node.model';

@Component({
  selector: 'osf-component-card',
  imports: [Button, Menu, TranslatePipe, TruncatedTextComponent, IconComponent, ContributorsListComponent],
  templateUrl: './component-card.component.html',
  styleUrl: './component-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentCardComponent {
  component = input.required<NodeModel>();
  anonymous = input.required<boolean>();
  hideDeleteAction = input<boolean>(false);

  navigate = output<string>();
  menuAction = output<NodeMenuAction>();

  readonly componentActionItems = computed(() => {
    const component = this.component();

    const baseItems = [
      {
        label: 'project.overview.actions.manageContributors',
        action: NodeMenuAction.ManageContributors,
      },
      {
        label: 'project.overview.actions.settings',
        action: NodeMenuAction.Settings,
      },
    ];

    if (!this.hideDeleteAction() && component.currentUserPermissions.includes(UserPermissions.Admin)) {
      baseItems.push({
        label: 'common.labels.delete',
        action: NodeMenuAction.Delete,
      });
    }

    return baseItems;
  });

  handleNavigate(componentId: string): void {
    this.navigate.emit(componentId);
  }

  handleMenuAction(action: NodeMenuAction): void {
    this.menuAction.emit(action);
  }
}
