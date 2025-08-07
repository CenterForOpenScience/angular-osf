import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

import { filter, map } from 'rxjs';

import { Component, computed, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { MENU_ITEMS, MODERATION_MENU_ITEM, PROJECT_MENU_ITEMS, REGISTRATION_MENU_ITEMS } from '@core/constants';
import { filterMenuItems } from '@osf/core/helpers';
import { ProviderSelectors } from '@osf/core/store/provider';
import { UserSelectors } from '@osf/core/store/user';
import { AuthSelectors } from '@osf/features/auth/store';
import { IconComponent } from '@osf/shared/components';

@Component({
  selector: 'osf-nav-menu',
  imports: [RouterLinkActive, RouterLink, PanelMenuModule, TranslatePipe, IconComponent],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  closeMenu = output<void>();

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly isAuthenticated = select(AuthSelectors.isAuthenticated);

  protected readonly myProjectMenuItems = PROJECT_MENU_ITEMS;
  protected readonly registrationMenuItems = computed(() => {
    const menu = [...REGISTRATION_MENU_ITEMS];
    if (this.isUserModerator()) {
      const menuItems = menu[0].items ?? [];
      if (!menuItems.some((item) => item.label === MODERATION_MENU_ITEM.label)) {
        menuItems.push(MODERATION_MENU_ITEM);
      }
    }
    const withRouterLinks = menu.map((section) => ({
      ...section,
      items: section.items?.map((item) => {
        const isModerationPage = item.state && item.state['isModeration'];
        const routeId = isModerationPage ? this.provider()?.id : this.currentResourceId();
        return {
          ...item,
          routerLink: item.routerLink ? ['/registries', routeId, item.routerLink] : null,
          queryParams: isModerationPage ? { resourceId: this.currentResourceId() } : {},
        };
      }),
    }));
    return withRouterLinks;
  });
  protected readonly isUserModerator = select(UserSelectors.isCurrentUserModerator);
  protected readonly provider = select(ProviderSelectors.getCurrentProvider);

  protected readonly mainMenuItems = computed(() => {
    const isAuthenticated = this.isAuthenticated();
    const menuItems = filterMenuItems(MENU_ITEMS, isAuthenticated);

    if (this.isRegistryRouteDetails()) {
      menuItems.map((menuItem) => {
        if (menuItem.id === 'registries') {
          menuItem.expanded = true;
          return menuItem;
        }
        return menuItem;
      });
    }

    return this.isCollectionsRoute() ? menuItems : menuItems.filter((item) => item.routerLink !== '/collections');
  });

  protected readonly currentRoute = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.getRouteInfo())
    ),
    {
      initialValue: this.getRouteInfo(),
    }
  );

  protected readonly currentResourceId = computed(() => this.currentRoute().resourceId);
  protected readonly isProjectRoute = computed(() => !!this.currentResourceId());
  protected readonly isCollectionsRoute = computed(() => this.currentRoute().isCollectionsWithId);
  protected readonly isRegistryRoute = computed(() => this.currentRoute().isRegistryRoute);
  protected readonly isRegistryRouteDetails = computed(() => this.currentRoute().isRegistryRouteDetails);

  private getRouteInfo() {
    const urlSegments = this.router.url.split('/').filter((segment) => segment);
    const resourceFromQueryParams = this.route.snapshot.queryParams['resourceId'];
    const resourceId = this.route.firstChild?.snapshot.params['id'] || resourceFromQueryParams;
    const section = this.route.firstChild?.firstChild?.snapshot.url[0]?.path || 'overview';
    const isCollectionsWithId = urlSegments[0] === 'collections' && urlSegments[1] && urlSegments[1] !== '';
    const isRegistryRoute = urlSegments[0] === 'registries' && !!urlSegments[2];
    const isRegistryRouteDetails = urlSegments[0] === 'registries' && urlSegments[2] === 'overview';
    return {
      resourceId,
      section,
      isCollectionsWithId,
      isRegistryRoute,
      isRegistryRouteDetails,
    };
  }

  goToLink(item: MenuItem) {
    if (!item.items) {
      this.closeMenu.emit();
    }
  }
}
