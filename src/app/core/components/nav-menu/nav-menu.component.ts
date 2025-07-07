import { TranslatePipe } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

import { filter, map } from 'rxjs';

import { Component, computed, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { MENU_ITEMS, PROJECT_MENU_ITEMS, REGISTRATION_MENU_ITEMS } from '@core/constants';
import { IconComponent } from '@osf/shared/components';

@Component({
  selector: 'osf-nav-menu',
  imports: [RouterLinkActive, RouterLink, PanelMenuModule, TranslatePipe, IconComponent],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly menuItems = MENU_ITEMS;
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

  protected readonly currentResourceId = computed(() => this.currentRoute().resourceId);
  protected readonly isProjectRoute = computed(() => !!this.currentResourceId());
  protected readonly isCollectionsRoute = computed(() => this.currentRoute().isCollectionsWithId);
  protected readonly isRegistryRoute = computed(() => this.currentRoute().isRegistryRoute);

  private getRouteInfo() {
    const urlSegments = this.router.url.split('/').filter((segment) => segment);

    const resourceId = this.route.firstChild?.snapshot.params['id'] || null;
    const section = this.route.firstChild?.firstChild?.snapshot.url[0]?.path || 'overview';

    const isCollectionsWithId = urlSegments[0] === 'collections' && urlSegments[1] && urlSegments[1] !== '';
    const isRegistryRoute = urlSegments[0] === 'registries' && !!urlSegments[2];

    return {
      resourceId,
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
