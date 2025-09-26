import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

import { filter, map } from 'rxjs';

import { Component, computed, effect, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { MENU_ITEMS } from '@core/constants';
import { ProviderSelectors } from '@core/store/provider';
import { filterMenuItems, updateMenuItems } from '@osf/core/helpers';
import { RouteContext } from '@osf/core/models';
import { AuthService } from '@osf/core/services';
import { UserSelectors } from '@osf/core/store/user';
import { IconComponent } from '@osf/shared/components';
import { CurrentResourceType, ResourceType, ReviewPermissions } from '@osf/shared/enums';
import { getViewOnlyParam } from '@osf/shared/helpers';
import { WrapFnPipe } from '@osf/shared/pipes';
import { CurrentResourceSelectors, GetResourceDetails } from '@osf/shared/stores';

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
  private readonly currentUserPermissions = select(CurrentResourceSelectors.getCurrentUserPermissions);
  private readonly isResourceDetailsLoading = select(CurrentResourceSelectors.isResourceDetailsLoading);
  private readonly provider = select(ProviderSelectors.getCurrentProvider);

  readonly actions = createDispatchMap({ getResourceDetails: GetResourceDetails });

  readonly resourceType = computed(() => {
    const type = this.currentResource()?.type;

    switch (type) {
      case CurrentResourceType.Projects:
        return ResourceType.Project;
      case CurrentResourceType.Registrations:
        return ResourceType.Registration;
      case CurrentResourceType.Preprints:
        return ResourceType.Preprint;
      default:
        return ResourceType.Project;
    }
  });

  constructor() {
    effect(() => {
      const resourceId = this.currentResourceId();
      const resourceType = this.resourceType();

      if (resourceId && resourceType) {
        this.actions.getResourceDetails(resourceId, resourceType);
      }
    });
  }

  readonly mainMenuItems = computed(() => {
    const isAuthenticated = this.isAuthenticated();
    const filtered = filterMenuItems(MENU_ITEMS, isAuthenticated);

    const routeContext: RouteContext = {
      resourceId: this.currentResourceId(),
      providerId: this.provider()?.id,
      isProject:
        this.currentResource()?.type === CurrentResourceType.Projects &&
        this.currentResourceId() === this.currentResource()?.id,
      wikiPageVisible: this.currentResource()?.wikiEnabled,
      isRegistry:
        this.currentResource()?.type === CurrentResourceType.Registrations &&
        this.currentResourceId() === this.currentResource()?.id,
      isPreprint: this.isPreprintRoute(),
      preprintReviewsPageVisible: this.canUserViewReviews(),
      registrationModerationPageVisible:
        this.provider()?.type === CurrentResourceType.Registrations &&
        this.provider()?.permissions?.includes(ReviewPermissions.ViewSubmissions),
      collectionModerationPageVisible:
        this.provider()?.type === CurrentResourceType.Collections &&
        this.provider()?.permissions?.includes(ReviewPermissions.ViewSubmissions),
      isCollections: this.isCollectionsRoute() || false,
      currentUrl: this.router.url,
      isViewOnly: !!getViewOnlyParam(this.router),
      permissions: this.currentUserPermissions(),
      isResourceDetailsLoading: this.isResourceDetailsLoading(),
    };

    const items = updateMenuItems(filtered, routeContext);

    return items;
  });

  readonly currentRoute = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.getRouteInfo())
    ),
    {
      initialValue: this.getRouteInfo(),
    }
  );

  readonly currentResourceId = computed(() => this.currentRoute().resourceId);
  readonly isCollectionsRoute = computed(() => this.currentRoute().isCollectionsWithId);
  readonly isPreprintRoute = computed(() => this.currentRoute().isPreprintRoute);
  readonly canUserViewReviews = select(UserSelectors.getCanViewReviews);

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

  readonly hasVisibleChildren = (item: MenuItem): boolean =>
    Array.isArray(item.items) && item.items.some((child) => !!child.visible);
}
