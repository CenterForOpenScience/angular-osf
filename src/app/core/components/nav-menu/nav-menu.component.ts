import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_ITEMS } from '@osf/core/helpers/nav-items.constant';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'osf-nav-menu',
  imports: [RouterLinkActive, RouterLink, PanelMenuModule],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  navItems = NAV_ITEMS;

  protected menuItems: MenuItem[] = this.navItems.map((item) =>
    this.convertToMenuItem(item),
  );

  private convertToMenuItem(item: (typeof NAV_ITEMS)[0]): MenuItem {
    const menuItem: MenuItem = {
      label: item.label,
      icon: item.icon ? `osf-icon-${item.icon}` : '',
      expanded: false,
    };

    if (!item.isCollapsible) {
      menuItem.routerLink = item.path;
    }

    if (item.items) {
      menuItem.items = item.items.map((subItem) =>
        this.convertToMenuItem(subItem),
      );
    }

    return menuItem;
  }
}
