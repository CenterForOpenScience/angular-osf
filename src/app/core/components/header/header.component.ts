import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { NavigationService } from '@osf/core/services';
import { UserSelectors } from '@osf/core/store/user';
import { AuthSelectors, Logout } from '@osf/features/auth/store';
import { LoaderService } from '@osf/shared/services';

import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'osf-header',
  imports: [BreadcrumbComponent, Menu, Button, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  currentUser = select(UserSelectors.getCurrentUser);
  isAuthenticated = select(AuthSelectors.isAuthenticated);

  private readonly router = inject(Router);
  private readonly loaderService = inject(LoaderService);
  private readonly navigationService = inject(NavigationService);
  private readonly actions = createDispatchMap({ logout: Logout });

  items = [
    {
      label: 'navigation.myProfile',
      command: () => this.router.navigate(['my-profile']),
    },
    { label: 'navigation.settings', command: () => this.router.navigate(['settings']) },
    {
      label: 'navigation.logOut',
      command: () => {
        this.loaderService.show();
        this.actions.logout();
        this.router.navigate(['/home']).then(() => window.location.reload());
      },
    },
  ];

  navigateToSignIn() {
    this.navigationService.navigateToSignIn();
  }
}
