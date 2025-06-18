import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { UserSelectors } from '@core/store/user/user.selectors';

@Component({
  selector: 'osf-header',
  imports: [BreadcrumbComponent, MenuModule, ButtonModule, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  currentUser = select(UserSelectors.getCurrentUser);

  private readonly router = inject(Router);

  items = [
    {
      label: 'navigation.myProfile',
      command: () => this.router.navigate(['my-profile']),
    },
    { label: 'navigation.settings', command: () => console.log('Settings') },
    { label: 'navigation.logOut', command: () => console.log('Log out') },
  ];
}
