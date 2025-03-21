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

  private convertToMenuItem(item: (typeof NAV_ITEMS)[number]): MenuItem {
    return {
      label: item.label,
      icon: item.icon ? `osf-icon-${item.icon}` : '',
      expanded: false,
      routerLink: item.isCollapsible ? undefined : item.path,
      items: item.items?.map((subItem) => this.convertToMenuItem(subItem)),
    };
  }

  protected menuItems: MenuItem[] = this.navItems.map((item) =>
    this.convertToMenuItem(item),
  );
}
