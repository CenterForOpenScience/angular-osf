import { TranslatePipe } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

import { filter, map } from 'rxjs';

import { Component, computed, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { NAV_ITEMS, PROJECT_MENU_ITEMS, REGISTRATION_MENU_ITEMS } from '@core/constants';
import { IconComponent } from '@osf/shared/components';
import { NavItem } from '@osf/shared/models';

@Component({
  selector: 'osf-nav-menu',
  imports: [RouterLinkActive, RouterLink, PanelMenuModule, TranslatePipe, IconComponent],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly navItems = NAV_ITEMS;
  protected readonly myProjectMenuItems = PROJECT_MENU_ITEMS;
  protected readonly registrationMenuItems = REGISTRATION_MENU_ITEMS;
  protected readonly mainMenuItems = this.navItems.map((item) => this.convertToMenuItem(item));

  closeMenu = output<void>();

  protected readonly currentRoute = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.getRouteInfo())
    ),
    {
      initialValue: this.getRouteInfo(),
    }
  );

  protected readonly currentProjectId = computed(() => this.currentRoute().projectId);
  protected readonly isProjectRoute = computed(() => !!this.currentProjectId());
  protected readonly isRegistryRoute = computed(() => {
    const segments = this.currentRoute().segments;
    if (segments && segments.length > 0) {
      return segments[0] === 'registries' && segments[1] === 'my-registrations' && !!segments[2];
    }
    return false;
  });

  convertToMenuItem(item: NavItem): MenuItem {
    const currentUrl = this.router.url;
    const isExpanded =
      item.isCollapsible &&
      (currentUrl.startsWith(item.path) ||
        (item.items?.some((subItem) => currentUrl.startsWith(subItem.path)) ?? false));

    return {
      label: item.label,
      icon: item.icon ? `osf-icon-${item.icon}` : '',
      expanded: isExpanded,
      routerLink: item.isCollapsible ? undefined : item.path,
      items: item.items?.map((subItem) => this.convertToMenuItem(subItem)),
    };
  }

  getRouteInfo() {
    const projectId = this.route.firstChild?.snapshot.params['id'] || null;
    const section = this.route.firstChild?.firstChild?.snapshot.url[0]?.path || 'overview';
    const segments = this.route.firstChild?.snapshot.url.map((s) => s.path);

    return { projectId, section, segments };
  }

  goToLink(item: MenuItem) {
    if (!item.items) {
      this.closeMenu.emit();
    }
  }
}
