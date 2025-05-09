import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngxs/store';
import { UserSelectors } from '@core/store/user/user.selectors';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'osf-header',
  imports: [
    BreadcrumbComponent,
    MenuModule,
    ButtonModule,
    TranslatePipe,
    RouterLink,
  ],
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
    this.#currentUrl()?.includes('sign-up')
      ? 'navigation.signIn'
      : 'navigation.signUp',
  );

  protected readonly authButtonLink = computed(() =>
    this.#currentUrl()?.includes('sign-up') ? '/login' : '/sign-up',
  );
}
