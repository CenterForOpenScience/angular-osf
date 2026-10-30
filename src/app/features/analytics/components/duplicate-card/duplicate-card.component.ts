import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { NodeMenuAction } from '@osf/shared/enums/node-menu-action.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { NodeModel } from '@osf/shared/models/nodes/base-node.model';

@Component({
  selector: 'osf-duplicate-card',
  imports: [
    Button,
    Menu,
    RouterLink,
    IconComponent,
    TruncatedTextComponent,
    ContributorsListComponent,
    DatePipe,
    TranslatePipe,
  ],
  templateUrl: './duplicate-card.component.html',
  styleUrl: './duplicate-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuplicateCardComponent {
  readonly duplicate = input.required<NodeModel>();

  readonly menuAction = output<NodeMenuAction>();

  readonly dateFormat = 'MMM d, y, h:mm a';

  readonly canManageDuplicate = computed(() => {
    const permissions = this.duplicate().currentUserPermissions;
    return permissions.includes(UserPermissions.Admin) || permissions.includes(UserPermissions.Write);
  });

  readonly menuItems = [
    {
      label: 'project.overview.actions.manageContributors',
      action: NodeMenuAction.ManageContributors,
    },
    {
      label: 'project.overview.actions.settings',
      action: NodeMenuAction.Settings,
    },
    {
      label: 'common.labels.delete',
      action: NodeMenuAction.Delete,
    },
  ];

  handleMenuAction(action: NodeMenuAction): void {
    this.menuAction.emit(action);
  }
}
