import { Component, inject, input } from '@angular/core';
import { Button } from 'primeng/button';
import { AddonCard } from '@shared/entities/addon-card.interface';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-addon-card',
  imports: [Button],
  templateUrl: './addon-card.component.html',
  styleUrl: './addon-card.component.scss',
})
export class AddonCardComponent {
  card = input<AddonCard>();
  cardButtonLabel = input<string>('');
  isMobile = toSignal(inject(IS_XSMALL));

  constructor(private router: Router) {}

  onConnect(): void {
    this.router.navigate(['/settings/addons/connect-addon']);
  }
}
