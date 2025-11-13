import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { PanelMenuModule } from 'primeng/panelmenu';

import { filter, map } from 'rxjs';

import { Component, computed, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { MENU_ITEMS } from '@core/constants/nav-items.constant';
import { filterMenuItems, updateMenuItems } from '@core/helpers/nav-menu.helper';
import { CustomMenuItem } from '@core/models/custom-menu-item.model';
import { RouteContext } from '@core/models/route-context.model';
import { AuthService } from '@core/services/auth.service';
import { ProviderSelectors } from '@core/store/provider';
import { UserSelectors } from '@core/store/user';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { ReviewPermissions } from '@osf/shared/enums/review-permissions.enum';
import { getViewOnlyParam } from '@osf/shared/helpers/view-only.helper';
import { WrapFnPipe } from '@osf/shared/pipes/wrap-fn.pipe';
import { CurrentResourceSelectors, GetResourceDetails } from '@osf/shared/stores/current-resource';

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
  private readonly provider = select(ProviderSelectors.getCurrentProvider);

  readonly actions = createDispatchMap({ getResourceDetails: GetResourceDetails });

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
        this.provider()?.permissions?.includes(ReviewPermissions.ViewSubmissions) &&
        !!this.provider()?.reviewsWorkflow,
      collectionModerationPageVisible:
        this.provider()?.type === CurrentResourceType.Collections &&
        this.provider()?.permissions?.includes(ReviewPermissions.ViewSubmissions),
      isCollections: this.isCollectionsRoute() || false,
      currentUrl: this.router.url,
      isViewOnly: !!getViewOnlyParam(this.router),
      permissions: this.currentResource()?.permissions,
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

  goToLink(item: CustomMenuItem) {
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

  readonly hasVisibleChildren = (item: CustomMenuItem): boolean =>
    Array.isArray(item.items) && item.items.some((child) => !!child.visible);
}
