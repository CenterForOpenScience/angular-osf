import { Component, input } from '@angular/core';

import { Addon, AuthorizedAddon } from '../../models';
import { AddonCardComponent } from '../addon-card/addon-card.component';

@Component({
  selector: 'osf-addon-card-list',
  imports: [AddonCardComponent],
  templateUrl: './addon-card-list.component.html',
  styleUrl: './addon-card-list.component.scss',
})
export class AddonCardListComponent {
  cards = input<(Addon | AuthorizedAddon)[]>([]);
  cardButtonLabel = input<string>('');
  showDangerButton = input<boolean>(false);
}
