import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

import { filter, map } from 'rxjs';

import { Component, computed, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { MENU_ITEMS } from '@core/constants';
import { filterMenuItems, updateMenuItems } from '@osf/core/helpers';
import { RouteContext } from '@osf/core/models';
import { AuthService } from '@osf/core/services';
import { UserSelectors } from '@osf/core/store/user';
import { IconComponent } from '@osf/shared/components';
import { CurrentResourceType } from '@osf/shared/enums';
import { WrapFnPipe } from '@osf/shared/pipes';
import { CurrentResourceSelectors } from '@osf/shared/stores';

@Component({
  selector: 'osf-nav-menu',
  imports: [RouterLinkActive, RouterLink, PanelMenuModule, TranslatePipe, IconComponent, WrapFnPipe],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  closeMenu = output<void>();

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  private readonly isAuthenticated = select(UserSelectors.isAuthenticated);
  private readonly currentResource = select(CurrentResourceSelectors.getCurrentResource);

  protected readonly mainMenuItems = computed(() => {
    const isAuthenticated = this.isAuthenticated();
    const filtered = filterMenuItems(MENU_ITEMS, isAuthenticated);

    const routeContext: RouteContext = {
      resourceId: this.currentResourceId(),
      providerId: this.currentProviderId(),
      isProject:
        this.currentResource()?.type === CurrentResourceType.Projects &&
        this.currentResourceId() === this.currentResource()?.id,
      isRegistry:
        this.currentResource()?.type === CurrentResourceType.Registrations &&
        this.currentResourceId() === this.currentResource()?.id,
      isPreprint: this.isPreprintRoute(),
      preprintReviewsPageVisible: this.canUserViewReviews(),
      isCollections: this.isCollectionsRoute() || false,
      currentUrl: this.router.url,
    };

    const items = updateMenuItems(filtered, routeContext);

    return items;
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
  protected readonly currentProviderId = computed(() => this.currentRoute().providerId);
  protected readonly isCollectionsRoute = computed(() => this.currentRoute().isCollectionsWithId);
  protected readonly isPreprintRoute = computed(() => this.currentRoute().isPreprintRoute);
  protected readonly canUserViewReviews = select(UserSelectors.getCanViewReviews);

  private getRouteInfo() {
    const urlSegments = this.router.url.split('/').filter((segment) => segment);
    const resourceFromQueryParams = this.route.snapshot.queryParams['resourceId'];
    const resourceId = this.route.firstChild?.snapshot.params['id'] || resourceFromQueryParams;
    const providerId = this.route.firstChild?.snapshot.params['providerId'];
    const isCollectionsWithId = urlSegments[0] === 'collections' && urlSegments[1] && urlSegments[1] !== '';
    const isPreprintRoute = urlSegments[0] === 'preprints' && !!urlSegments[2];

    return {
      resourceId,
      providerId,
      isCollectionsWithId,
      isPreprintRoute,
    };
  }

  goToLink(item: MenuItem) {
    if (item.id === 'support' || item.id === 'donate') {
      window.open(item.url, '_blank');
    }

    if (item.id === 'sign-in') {
      this.authService.navigateToSignIn();
      return;
    }

    if (item.id === 'log-out') {
      this.authService.logout();
      return;
    }

    if (!item.items) {
      this.closeMenu.emit();
    }
  }

  protected readonly hasVisibleChildren = (item: MenuItem): boolean =>
    Array.isArray(item.items) && item.items.some((child) => !!child.visible);
}
