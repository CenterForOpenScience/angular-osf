import { Component, inject, input } from '@angular/core';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { Addon } from '@shared/entities/addons.entities';

@Component({
  selector: 'osf-addon-card',
  imports: [Button],
  templateUrl: './addon-card.component.html',
  styleUrl: './addon-card.component.scss',
})
export class AddonCardComponent {
  card = input<Addon>();
  cardButtonLabel = input<string>('');
  isMobile = toSignal(inject(IS_XSMALL));

  constructor(private router: Router) {}

  onConnect(): void {
    this.router.navigate(['/settings/addons/connect-addon']);
  }
}
