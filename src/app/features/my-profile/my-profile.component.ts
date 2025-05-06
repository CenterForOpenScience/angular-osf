import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserSelectors } from '@osf/core/store/user/user.selectors';
import { Button } from 'primeng/button';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@osf/shared/utils/breakpoints.tokens';
import { Router } from '@angular/router';

@Component({
  selector: 'osf-my-profile',
  imports: [Button, DatePipe, NgOptimizedImage, AccordionModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileComponent {
  readonly #store = inject(Store);
  readonly #router = inject(Router);
  readonly currentUser = this.#store.selectSignal(UserSelectors.getCurrentUser);
  readonly isMobile = toSignal(inject(IS_XSMALL));

  toProfileSettings() {
    this.#router.navigate(['settings/profile-settings']);
  }
}
