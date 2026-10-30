import { TranslatePipe } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'osf-fork-menu-button',
  imports: [Button, Menu, Tooltip, TranslatePipe],
  templateUrl: './fork-menu-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForkMenuButtonComponent {
  readonly forksCount = input.required<number>();
  readonly menuItems = input.required<MenuItem[]>();
  readonly preventDuplicateCreation = input(false);

  readonly viewDuplicates = output<void>();
}
