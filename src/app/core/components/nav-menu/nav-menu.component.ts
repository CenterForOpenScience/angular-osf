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
  protected readonly isCollectionsRoute = computed(() => this.currentRoute().isCollectionsWithId);
  protected readonly isRegistryRoute = computed(() => this.currentRoute().isRegistryRoute);

  protected readonly mainMenuItems = computed(() => {
    const filteredItems = this.isCollectionsRoute()
      ? this.navItems
      : this.navItems.filter((item) => item.path !== '/collections');

    return filteredItems.map((item) => this.convertToMenuItem(item));
  });

  private convertToMenuItem(item: NavItem): MenuItem {
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

  private getRouteInfo() {
    const url = this.router.url;
    const urlSegments = url.split('/').filter((segment) => segment);

    const projectId = this.route.firstChild?.snapshot.params['id'] || null;
    const section = this.route.firstChild?.firstChild?.snapshot.url[0]?.path || 'overview';

    const isCollectionsWithId = urlSegments[0] === 'collections' && urlSegments[1] && urlSegments[1] !== '';
    const isRegistryRoute =
      urlSegments[0] === 'registries' && urlSegments[1] === 'my-registrations' && !!urlSegments[2];

    return {
      projectId,
      section,
      isCollectionsWithId,
      isRegistryRoute,
    };
  }

  goToLink(item: MenuItem) {
    if (!item.items) {
      this.closeMenu.emit();
    }
  }
}
