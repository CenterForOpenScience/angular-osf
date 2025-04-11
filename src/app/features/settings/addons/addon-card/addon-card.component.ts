import { Component, inject, input } from '@angular/core';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import {
  Addon,
  AuthorizedAddon,
} from '@osf/features/settings/addons/entities/addons.entities';

@Component({
  selector: 'osf-addon-card',
  imports: [Button],
  templateUrl: './addon-card.component.html',
  styleUrl: './addon-card.component.scss',
})
export class AddonCardComponent {
  card = input<Addon | AuthorizedAddon>();
  cardButtonLabel = input<string>('');
  isMobile = toSignal(inject(IS_XSMALL));

  constructor(private router: Router) {}

  onConnect(): void {
    const addon = this.card();
    if (addon) {
      this.router.navigate(['/settings/addons/connect-addon'], {
        state: { addon },
      });
    }
  }
}
