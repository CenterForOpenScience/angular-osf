import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@osf/core/services';
import { UserSelectors } from '@osf/core/store/user';

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

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  items = [
    {
      label: 'navigation.myProfile',
      command: () => this.router.navigate(['my-profile']),
    },
    { label: 'navigation.settings', command: () => this.router.navigate(['settings']) },
    {
      label: 'navigation.logOut',
      command: () => {
        this.authService.logout();
      },
    },
  ];

  navigateToSignIn() {
    this.authService.navigateToSignIn();
  }
}
