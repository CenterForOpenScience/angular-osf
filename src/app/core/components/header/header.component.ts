import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

import { map } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { UserSelectors } from '@core/store/user/user.selectors';

@Component({
  standalone: true,
  selector: 'osf-header',
  imports: [BreadcrumbComponent, MenuModule, ButtonModule, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly #store = inject(Store);
  readonly #router = inject(Router);
  readonly currentUser = this.#store.selectSignal(UserSelectors.getCurrentUser);

  items = [
    {
      label: 'navigation.myProfile',
      command: () => this.#router.navigate(['my-profile']),
    },
    { label: 'navigation.settings', command: () => console.log('Settings') },
    { label: 'navigation.logOut', command: () => console.log('Log out') },
  ];

  #currentUrl = toSignal(this.#router.events.pipe(map(() => this.#router.url)));

  protected readonly authButtonText = computed(() =>
    this.#currentUrl()?.includes('sign-up') ? 'navigation.signIn' : 'navigation.signUp'
  );

  protected readonly authButtonLink = computed(() => (this.#currentUrl()?.includes('sign-up') ? '/login' : '/sign-up'));
}
