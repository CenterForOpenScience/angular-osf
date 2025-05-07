import { Component, computed, inject } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  Router,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import {
  NAV_ITEMS,
  PROJECT_MENU_ITEMS,
} from '@core/constants/nav-items.constant';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { NavItem } from '@shared/entities/nav-item.interface';

@Component({
  selector: 'osf-nav-menu',
  imports: [RouterLinkActive, RouterLink, PanelMenuModule],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  protected readonly navItems = NAV_ITEMS;
  protected readonly myProjectMenuItems = PROJECT_MENU_ITEMS;
  protected readonly mainMenuItems = this.navItems.map((item) =>
    this.#convertToMenuItem(item),
  );

  protected readonly currentRoute = toSignal(
    this.#router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.#getRouteInfo()),
    ),
    {
      initialValue: this.#getRouteInfo(),
    },
  );

  protected readonly currentProjectId = computed(
    () => this.currentRoute().projectId,
  );
  protected readonly isProjectRoute = computed(() => !!this.currentProjectId());

  #convertToMenuItem(item: NavItem): MenuItem {
    const currentUrl = this.#router.url;
    const isExpanded = item.isCollapsible && currentUrl.startsWith(item.path);

    return {
      label: item.label,
      icon: item.icon ? `osf-icon-${item.icon}` : '',
      expanded: isExpanded,
      routerLink: item.isCollapsible ? undefined : item.path,
      items: item.items?.map((subItem) => this.#convertToMenuItem(subItem)),
    };
  }

  #getRouteInfo() {
    const projectId = this.#route.firstChild?.snapshot.params['id'] || null;
    const section =
      this.#route.firstChild?.firstChild?.snapshot.url[0]?.path || 'overview';

    return { projectId, section };
  }
}
